import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import complaint, voice
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Formify Backend API",
    description="Backend services for Voice-enabled Complaint Letter Generator",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(complaint.router)
app.include_router(voice.router)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "app": "Formify",
        "version": "1.0.0"
    }
