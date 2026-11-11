import json

from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine
from app.services.parser import extract_text
from app.services.analyzer import tailor_cv, extract_master_cv

router = APIRouter()


def initialize_database():
    with engine.begin() as connection:
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS master_cv (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                filename TEXT NOT NULL,
                raw_text TEXT NOT NULL,
                structured_cv TEXT NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """))
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS tailored_cv (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                job_id INTEGER,
                job_title TEXT NOT NULL DEFAULT '',
                company TEXT NOT NULL DEFAULT '',
                job_description TEXT NOT NULL,
                tailored_content TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """))
        # Safe migration for databases where tailored_cv already exists.
        connection.execute(text("ALTER TABLE tailored_cv ADD COLUMN IF NOT EXISTS job_id INTEGER"))
        connection.execute(text("CREATE INDEX IF NOT EXISTS ix_tailored_cv_job_id ON tailored_cv (job_id)"))


initialize_database()


def save_master_cv(filename: str, raw_text: str, master_cv: dict):
    with engine.begin() as connection:
        connection.execute(text("""
            INSERT INTO master_cv (id, filename, raw_text, structured_cv, updated_at)
            VALUES (1, :filename, :raw_text, :structured_cv, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET
                filename = EXCLUDED.filename,
                raw_text = EXCLUDED.raw_text,
                structured_cv = EXCLUDED.structured_cv,
                updated_at = CURRENT_TIMESTAMP
        """), {
            "filename": filename,
            "raw_text": raw_text,
            "structured_cv": json.dumps(master_cv, ensure_ascii=False),
        })


def get_saved_master_cv():
    with engine.connect() as connection:
        row = connection.execute(text("""
            SELECT filename, raw_text, structured_cv, updated_at
            FROM master_cv WHERE id = 1
        """)).mappings().first()
    if row is None:
        return None
    return {
        "filename": row["filename"],
        "text": row["raw_text"],
        "master_cv": json.loads(row["structured_cv"]),
        "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None,
    }


class TailorRequest(BaseModel):
    master_cv: str = Field(min_length=50)
    job_description: str = Field(min_length=50)
    analysis: dict | None = None
    structured_cv: dict | None = None
    job_id: int | None = None
    job_title: str = ""
    company: str = ""


@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    filename = file.filename or ""
    suffix = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if suffix not in {"pdf", "docx", "txt"}:
        raise HTTPException(status_code=400, detail="Supported CV formats: PDF, DOCX, TXT.")
    data = await file.read()
    try:
        cv_text = extract_text(data, "." + suffix)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {exc}") from exc
    if not cv_text.strip():
        raise HTTPException(status_code=400, detail="The CV contains no readable text.")
    try:
        master_cv = await extract_master_cv(cv_text)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"CV text was extracted, but AI structuring failed: {exc}") from exc
    try:
        save_master_cv(filename, cv_text, master_cv)
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=500, detail="Could not save Master CV to PostgreSQL.") from exc
    return {"filename": filename, "text": cv_text, "character_count": len(cv_text), "master_cv": master_cv, "saved": True}


@router.get("/current")
async def current_master_cv():
    try:
        saved_cv = get_saved_master_cv()
    except (SQLAlchemyError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail="Could not retrieve Master CV from PostgreSQL.") from exc
    if saved_cv is None:
        raise HTTPException(status_code=404, detail="No Master CV has been saved yet. Upload a CV first.")
    return saved_cv


@router.post("/tailor")
async def tailor(request: TailorRequest):
    try:
        source_cv = request.structured_cv or request.master_cv
        tailored_result = await tailor_cv(
            json.dumps(source_cv, ensure_ascii=False) if isinstance(source_cv, dict) else source_cv,
            request.job_description,
            request.analysis,
        )
        with engine.begin() as connection:
            result = connection.execute(text("""
                INSERT INTO tailored_cv (job_id, job_title, company, job_description, tailored_content)
                VALUES (:job_id, :job_title, :company, :job_description, :tailored_content)
                RETURNING id, created_at
            """), {
                "job_id": request.job_id,
                "job_title": request.job_title,
                "company": request.company,
                "job_description": request.job_description,
                "tailored_content": json.dumps(tailored_result, ensure_ascii=False),
            }).mappings().one()
        return {
            **tailored_result,
            "saved": True,
            "saved_cv_id": result["id"],
            "job_id": request.job_id,
            "job_title": request.job_title,
            "company": request.company,
        }
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"CV tailoring or saving failed: {type(exc).__name__}: {exc}") from exc


@router.get("/tailored")
async def get_tailored_cvs():
    try:
        with engine.connect() as connection:
            rows = connection.execute(text("""
                SELECT id, job_id, job_title, company, job_description, tailored_content, created_at
                FROM tailored_cv
                ORDER BY created_at DESC, id DESC
            """)).mappings().all()
        return [{
            "id": row["id"],
            "job_id": row["job_id"],
            "job_title": row["job_title"],
            "company": row["company"],
            "job_description": row["job_description"],
            "tailored_content": json.loads(row["tailored_content"]),
            "created_at": row["created_at"].isoformat() if row["created_at"] else None,
        } for row in rows]
    except (SQLAlchemyError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail="Could not retrieve saved tailored CVs.") from exc
