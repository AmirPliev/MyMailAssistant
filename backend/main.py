import os
import logging
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from qdrant_client import QdrantClient
from init_qdrant import init_qdrant

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MyMailAssistant API")

# Configuration
POCKETBASE_URL = os.getenv("POCKETBASE_URL", "http://pocketbase:8080")
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Qdrant collections...")
    try:
        init_qdrant()
    except Exception as e:
        logger.error(f"Failed to initialize Qdrant: {e}")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to MyMailAssistant API"}

@app.get("/health")
async def health_check():
    health_status = {
        "status": "healthy",
        "services": {
            "pocketbase": "unknown",
            "qdrant": "unknown"
        }
    }

    # Ping PocketBase
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{POCKETBASE_URL}/api/health", timeout=2.0)
            if resp.status_code == 200:
                health_status["services"]["pocketbase"] = "connected"
            else:
                health_status["services"]["pocketbase"] = f"error: {resp.status_code}"
                health_status["status"] = "unhealthy"
    except Exception as e:
        health_status["services"]["pocketbase"] = f"unreachable: {str(e)}"
        health_status["status"] = "unhealthy"

    # Ping Qdrant
    try:
        q_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT, api_key=QDRANT_API_KEY)
        q_client.get_collections()
        health_status["services"]["qdrant"] = "connected"
    except Exception as e:
        health_status["services"]["qdrant"] = f"unreachable: {str(e)}"
        health_status["status"] = "unhealthy"

    return health_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
