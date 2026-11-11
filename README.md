# CareerPilot MVP

CareerPilot is an evidence-grounded career assistant: upload a master CV, analyze a job description, and generate a tailored CV without inventing candidate facts.

## Stack
- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI + Python
- AI: OpenRouter using the OpenAI-compatible SDK

## Run locally

### Backend
```cmd
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=openai/gpt-5
```

Then:
```cmd
uvicorn app.main:app --reload
```

### Frontend
In a second terminal:
```cmd
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Current workflow
1. Upload a PDF/DOCX/TXT master CV.
2. Paste a job description.
3. Analyze the match.
4. Generate an evidence-grounded tailored CV.
5. Use Print / Save PDF for a temporary PDF export.

The next production stages are structured candidate evidence storage, stronger verification, DOCX/PDF rendering, job discovery, authentication, persistence, and application tracking.
