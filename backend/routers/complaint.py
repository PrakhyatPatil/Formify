from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
import uuid
from datetime import datetime
from models import ComplaintCreate, ComplaintResponse
from services.gemini_service import GeminiService
from services.pdf_service import PDFGenerator

router = APIRouter(prefix="/api/complaints", tags=["complaints"])
gemini_service = GeminiService()

# In-memory DB mockup
db_complaints = {}

@router.post("/generate", response_model=ComplaintResponse)
async def generate_complaint(payload: ComplaintCreate):
    try:
        # Call Gemini Service
        result = gemini_service.generate_complaint_letter(
            description=payload.description,
            priority=payload.priority,
            category=payload.category
        )
        
        # Save to mock database
        complaint_id = str(uuid.uuid4())
        complaint_data = ComplaintResponse(
            id=complaint_id,
            title=result.get("title", "Generated Complaint"),
            description=payload.description,
            priority=payload.priority,
            category=payload.category,
            letter_text=result.get("letter_text", ""),
            created_at=datetime.utcnow().isoformat()
        )
        db_complaints[complaint_id] = complaint_data
        return complaint_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate complaint letter: {str(e)}")

@router.get("", response_model=list[ComplaintResponse])
async def list_complaints():
    # Return sorted by created_at descending
    return sorted(db_complaints.values(), key=lambda x: x.created_at, reverse=True)

@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str):
    if complaint_id not in db_complaints:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return db_complaints[complaint_id]

@router.get("/{complaint_id}/pdf")
async def export_pdf(complaint_id: str):
    if complaint_id not in db_complaints:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint = db_complaints[complaint_id]
    pdf_buffer = PDFGenerator.generate_letter_pdf(
        title=complaint.title,
        letter_text=complaint.letter_text,
        priority=complaint.priority
    )
    
    filename = f"complaint_{complaint_id[:8]}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.delete("/{complaint_id}")
async def delete_complaint(complaint_id: str):
    if complaint_id not in db_complaints:
        raise HTTPException(status_code=404, detail="Complaint not found")
    del db_complaints[complaint_id]
    return {"status": "success", "message": "Complaint deleted"}
