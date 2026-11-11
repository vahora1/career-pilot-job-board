import json
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine

router = APIRouter()

DEFAULT_SETTINGS: dict[str, Any] = {
    "ai_provider": "OpenRouter",
    "ai_model": "openrouter/free",
    "max_output_tokens": 4096,
    "retry_failed_generations": True,
    "retry_count": 2,
    "cv_output_format": "structured",
    "preferred_cv_length": "1-2 pages",
    "preferred_cv_format": "PDF",
    "include_professional_summary": True,
    "include_certifications": True,
    "language_variant": "UK English",
    "preserve_employment_dates": True,
    "preferred_job_titles": ["Data Scientist", "ML Engineer", "Data Analyst"],
    "preferred_locations": ["Dubai, UAE"],
    "employment_types": ["Full-time"],
    "work_modes": ["On-site", "Hybrid", "Remote"],
    "salary_min": None,
    "salary_max": None,
    "notify_new_jobs": True,
    "notify_tailoring_complete": True,
    "notify_tailoring_failed": True,
    "notify_application_reminders": True,
}


def initialize_settings_table() -> None:
    with engine.begin() as connection:
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS app_settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                settings_json TEXT NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """))
        connection.execute(text("""
            INSERT INTO app_settings (id, settings_json)
            VALUES (1, :settings_json)
            ON CONFLICT (id) DO NOTHING
        """), {"settings_json": json.dumps(DEFAULT_SETTINGS)})


initialize_settings_table()


class SettingsUpdate(BaseModel):
    settings: dict[str, Any] = Field(...)


@router.get("")
async def get_settings():
    try:
        with engine.connect() as connection:
            row = connection.execute(text(
                "SELECT settings_json, updated_at FROM app_settings WHERE id = 1"
            )).mappings().first()
        if row is None:
            return {"settings": DEFAULT_SETTINGS, "updated_at": None}
        saved = json.loads(row["settings_json"])
        merged = {**DEFAULT_SETTINGS, **saved}
        return {
            "settings": merged,
            "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None,
        }
    except (SQLAlchemyError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail="Could not load settings.") from exc


@router.put("")
async def update_settings(request: SettingsUpdate):
    # Merge submitted fields with existing values so partial updates do not erase settings.
    try:
        with engine.begin() as connection:
            row = connection.execute(text(
                "SELECT settings_json FROM app_settings WHERE id = 1 FOR UPDATE"
            )).mappings().first()
            current = json.loads(row["settings_json"]) if row else DEFAULT_SETTINGS.copy()
            updated = {**DEFAULT_SETTINGS, **current, **request.settings}
            connection.execute(text("""
                INSERT INTO app_settings (id, settings_json, updated_at)
                VALUES (1, :settings_json, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO UPDATE SET
                    settings_json = EXCLUDED.settings_json,
                    updated_at = CURRENT_TIMESTAMP
            """), {"settings_json": json.dumps(updated, ensure_ascii=False)})
        return {"saved": True, "settings": updated}
    except (SQLAlchemyError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail="Could not save settings.") from exc
