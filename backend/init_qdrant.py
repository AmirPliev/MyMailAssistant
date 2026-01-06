import os
import json
import logging
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
COLLECTIONS_DIR = "/app/qdrant_collections"

def init_qdrant():
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
    
    if not os.path.exists(COLLECTIONS_DIR):
        logger.warning(f"Collections directory {COLLECTIONS_DIR} not found.")
        return

    for filename in os.listdir(COLLECTIONS_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(COLLECTIONS_DIR, filename), "r") as f:
                config = json.load(f)
                name = config["name"]
                
                try:
                    client.get_collection(collection_name=name)
                    logger.info(f"Collection '{name}' already exists.")
                except Exception:
                    logger.info(f"Creating collection '{name}'...")
                    vectors_config = config.get("vectors", {})
                    client.create_collection(
                        collection_name=name,
                        vectors_config=VectorParams(
                            size=vectors_config.get("size", 1536),
                            distance=Distance(vectors_config.get("distance", "Cosine"))
                        )
                    )
                    logger.info(f"Collection '{name}' created successfully.")

if __name__ == "__main__":
    init_qdrant()
