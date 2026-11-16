
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field
from pwdlib import PasswordHash
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.exc import IntegrityError

from app.database import Base, SessionLocal

router = APIRouter()
password_hash = PasswordHash.recommended()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


def user_response(user):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(data: RegisterRequest):
    full_name = data.full_name.strip()
    email = data.email.strip().lower()

    if len(full_name) < 2:
        raise HTTPException(status_code=400, detail="Please enter your full name.")

    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists.",
            )

        user = User(
            full_name=full_name,
            email=email,
            hashed_password=password_hash.hash(data.password),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "Account created successfully.",
            "user": user_response(user),
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )
    finally:
        db.close()


@router.post("/login")
def login_user(data: LoginRequest, request: Request):
    email = data.email.strip().lower()
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == email).first()

        if not user or not password_hash.verify(
            data.password, user.hashed_password
        ):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email address or password.",
            )

        request.session.clear()
        request.session["user_id"] = user.id

        return {
            "message": "Login successful.",
            "user": user_response(user),
        }
    finally:
        db.close()


@router.get("/me")
def get_current_user(request: Request):
    user_id = request.session.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="You are not logged in.",
        )

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            request.session.clear()
            raise HTTPException(
                status_code=401,
                detail="User account not found.",
            )

        return {"user": user_response(user)}
    finally:
        db.close()


@router.post("/logout")
def logout_user(request: Request):
    request.session.clear()
    return {"message": "Logged out successfully."}
