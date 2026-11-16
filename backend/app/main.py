
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.api.cv import router as cv_router
from app.api.jobs import router as jobs_router
from app.api.settings import router as settings_router
from app.api.auth import router as auth_router, User

from app.database import Base, engine


app = FastAPI(title="CareerPilot API", version="0.1.0")
app.add_middleware(
    SessionMiddleware,
    secret_key=os.environ["SESSION_SECRET"],
    session_cookie="careerpilot_session",
    same_site="none",
    https_only=True,
    max_age=60 * 60 * 24 * 7,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_auth_tables():
    Base.metadata.create_all(
        bind=engine,
        tables=[User.__table__],
    )


app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(settings_router, prefix="/api/settings", tags=["Settings"])
app.include_router(cv_router, prefix="/api/cv", tags=["CV"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])


@app.get("/health")
def health():
    return {"status": "ok"}
