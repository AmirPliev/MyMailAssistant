import os
import json
import logging
from typing import Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

QDRANT_HOST: str = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY")
COLLECTIONS_DIR: str = "/app/qdrant_collections"

def _load_collection_config(file_path: str) -> Optional[Dict[str, Any]]:
    """Load and parse collection configuration from a JSON file."""
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        logger.error(f"Failed to load config from {file_path}: {e}")
        return None

def _get_collection_params(config: Dict[str, Any]) -> VectorParams:
    """Extract VectorParams from collection configuration."""
    vectors_config = config.get("vectors", {})
    return VectorParams(
        size=vectors_config.get("size", 1536),
        distance=Distance(vectors_config.get("distance", "Cosine"))
    )

def _ensure_collection(client: QdrantClient, name: str, config: Dict[str, Any]) -> None:
    """Check if collection exists, if not, create it."""
    try:
        client.get_collection(collection_name=name)
        logger.info(f"Collection '{name}' already exists.")
    except Exception:
        logger.info(f"Creating collection '{name}'...")
        params = _get_collection_params(config)
        client.create_collection(
            collection_name=name,
            vectors_config=params
        )
        logger.info(f"Collection '{name}' created successfully.")

def init_qdrant() -> None:
    """Initialize Qdrant with collections defined in the collections directory."""
    client = QdrantClient(
        host=QDRANT_HOST, 
        port=QDRANT_PORT, 
        api_key=QDRANT_API_KEY, 
        https=False
    )
    
    if not os.path.exists(COLLECTIONS_DIR):
        logger.warning(f"Collections directory {COLLECTIONS_DIR} not found.")
        return

    for filename in os.listdir(COLLECTIONS_DIR):
        if not filename.endswith(".json"):
            continue
            
        file_path = os.path.join(COLLECTIONS_DIR, filename)
        config = _load_collection_config(file_path)
        if not config:
            continue
            
        name = config.get("name", filename[:-5])
        _ensure_collection(client, name, config)

if __name__ == "__main__":
    init_qdrant()
