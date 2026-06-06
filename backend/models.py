from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    description: str = Field(..., description="The user's transcribed or typed complaint description")
    priority: str = Field("medium", description="Priority level: low, medium, high")
    category: Optional[str] = Field(None, description="Category of the complaint (e.g., Billing, Support, Product)")

class ComplaintResponse(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    category: Optional[str] = None
    letter_text: str
    created_at: str

class VoiceTranscribeRequest(BaseModel):
    # If using backend transcription, but browser Web Speech API is preferred
    audio_base64: str
