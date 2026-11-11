from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.analyzer import analyze_job

router = APIRouter()

class AnalyzeRequest(BaseModel):
    master_cv: str = Field(min_length=50)
    job_description: str = Field(min_length=50)

@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        return await analyze_job(request.master_cv, request.job_description)
    except Exception as exc:
        raise HTTPException(500, f"Job analysis failed: {exc}") from exc
