from fastapi import APIRouter

router = APIRouter(prefix="/api/voice", tags=["voice"])

@router.get("/config")
async def get_voice_config():
    """
    Returns speech recognition settings and fallback configurations for frontend client.
    """
    return {
        "supported_languages": ["en-US", "en-GB", "es-ES", "fr-FR", "de-DE"],
        "default_language": "en-US",
        "api_transcribe_fallback_enabled": False
    }
