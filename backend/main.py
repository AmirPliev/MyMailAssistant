import os
import asyncio
import logging
import httpx
from typing import Dict, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from qdrant_client import QdrantClient
from init_qdrant import init_qdrant
from imap_worker import IMAPWorker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MyMailAssistant API")

# Configuration
POCKETBASE_URL: str = os.getenv("POCKETBASE_URL", "http://pocketbase:8080")
QDRANT_HOST: str = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")

imap_worker = IMAPWorker()

@app.on_event("startup")
async def startup_event() -> None:
    """Initialize services and start background tasks on startup."""
    logger.info("Initializing Qdrant collections...")
    try:
        init_qdrant()
    except Exception as e:
        logger.error(f"Failed to initialize Qdrant: {e}")

    logger.info("Starting IMAP background worker...")
    asyncio.create_task(imap_worker.run())

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def _check_pocketbase() -> str:
    """Ping PocketBase and return status."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{POCKETBASE_URL}/api/health", timeout=2.0)
            return "connected" if resp.status_code == 200 else f"error: {resp.status_code}"
    except Exception as e:
        return f"unreachable: {str(e)}"

def _check_qdrant() -> str:
    """Ping Qdrant and return status."""
    try:
        q_client = QdrantClient(
            host=QDRANT_HOST, 
            port=QDRANT_PORT, 
            api_key=QDRANT_API_KEY, 
            https=False
        )
        q_client.get_collections()
        return "connected"
    except Exception as e:
        return f"unreachable: {str(e)}"

@app.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint for API welcome message."""
    return {"message": "Welcome to MyMailAssistant API"}

@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint to verify connectivity to dependencies."""
    pb_status = await _check_pocketbase()
    qdrant_status = _check_qdrant()
    
    overall_status = "healthy"
    if "error" in pb_status or "unreachable" in pb_status or "unreachable" in qdrant_status:
        overall_status = "unhealthy"

    return {
        "status": overall_status,
        "services": {
            "pocketbase": pb_status,
            "qdrant": qdrant_status
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
