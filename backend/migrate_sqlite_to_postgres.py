
import json
import sqlite3
from pathlib import Path

from sqlalchemy import text

from app.database import engine

BASE_DIR = Path(__file__).resolve().parent
SQLITE_PATH = BASE_DIR / "careerpilot.db"


def migrate():
    if not SQLITE_PATH.exists():
        raise FileNotFoundError(
            f"SQLite database not found: {SQLITE_PATH}"
        )

    # Read the existing saved CV without modifying SQLite.
    with sqlite3.connect(SQLITE_PATH) as sqlite_conn:
        sqlite_conn.row_factory = sqlite3.Row
        row = sqlite_conn.execute(
            "SELECT * FROM master_cv WHERE id = 1"
        ).fetchone()

    if row is None:
        print("No saved Master CV found in SQLite. Nothing to migrate.")
        return

    filename = row["filename"]
    raw_text = row["raw_text"]
    structured_cv = row["structured_cv"]
    updated_at = row["updated_at"]

    # Validate the stored structured CV before writing it.
    json.loads(structured_cv)

    # Create the PostgreSQL table and copy the record in one transaction.
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

        connection.execute(
            text("""
                INSERT INTO master_cv (
                    id, filename, raw_text, structured_cv, updated_at
                )
                VALUES (
                    1, :filename, :raw_text, :structured_cv,
                    CAST(:updated_at AS TIMESTAMP)
                )
                ON CONFLICT (id) DO UPDATE SET
                    filename = EXCLUDED.filename,
                    raw_text = EXCLUDED.raw_text,
                    structured_cv = EXCLUDED.structured_cv,
                    updated_at = EXCLUDED.updated_at
            """),
            {
                "filename": filename,
                "raw_text": raw_text,
                "structured_cv": structured_cv,
                "updated_at": updated_at,
            },
        )

        saved = connection.execute(
            text("""
                SELECT filename, updated_at
                FROM master_cv
                WHERE id = 1
            """)
        ).fetchone()

    print("Migration successful.")
    print(f"CV filename: {saved.filename}")
    print(f"Updated at: {saved.updated_at}")
    print("Original SQLite database has not been changed.")


if __name__ == "__main__":
    migrate()
