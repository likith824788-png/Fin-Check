"""
FINCHECK AI - Financial Statement Consistency Review & Discrepancy Detection Backend
"""
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fincheck.main")

# Initialize FastAPI application
app = FastAPI(
    title="FINCHECK AI Backend",
    description="Financial Statement Consistency Review and Discrepancy Detection Platform API",
    version="1.0.0"
)

# CORS configuration for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
from app.routes import auth, documents, facts, findings, analysis, evidence, chat, reports

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(facts.router)
app.include_router(findings.router)
app.include_router(analysis.router)
app.include_router(evidence.router)
app.include_router(chat.router)
app.include_router(reports.router)

# Mount uploads directory
upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "FINCHECK AI Core Backend",
        "health": "/api/health",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "FINCHECK AI Core Backend",
        "version": "1.0.0",
        "engines": {
            "primary_extraction": "nemotron" if (os.getenv("NEMOTRON_API_KEY") or os.getenv("NVIDIA_API_KEY")) else "fallback",
            "deterministic_math": "deterministic_python",
            "secondary_verification": "gemma" if (os.getenv("GEMMA_API_KEY") or os.getenv("GEMINI_API_KEY")) else "fallback",
            "ai_auditor": "groq" if os.getenv("GROQ_API_KEY") else "fallback",
            "persistence": "firebase" if os.getenv("FIREBASE_PROJECT_ID") else "local_store"
        }
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
