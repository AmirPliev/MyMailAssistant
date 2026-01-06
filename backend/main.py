from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from init_qdrant import init_qdrant
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="MyMailAssistant API")

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
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
