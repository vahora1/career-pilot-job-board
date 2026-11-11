from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.cv import router as cv_router
from app.api.jobs import router as jobs_router
from app.api.settings import router as settings_router



app = FastAPI(title="CareerPilot API", version="0.1.0")
app.include_router(settings_router, prefix="/api/settings", tags=["Settings"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router, prefix="/api/cv", tags=["CV"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])

@app.get("/health")
def health():
    return {"status": "ok"}
