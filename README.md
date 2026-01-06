# MyMailAssistant

A modern web application for mail assistance, built with Next.js, PocketBase, and FastAPI.

## Project Structure

- `frontend/`: Next.js application (Typescript, Tailwind CSS, Shadcn UI).
- `pocketbase/`: PocketBase backend (Auth & Database).
- `backend/`: Python backend (FastAPI, LangChain, LangGraph).
- `qdrant/`: Qdrant vector database (Vector Search).

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.

### Development

To start the application in development mode with hot reloading:

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- PocketBase Admin: [http://localhost:8090/_/](http://localhost:8090/_/)
- Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)
- Qdrant Dashboard: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

### Production

To start the application in production mode:

```bash
docker compose -f docker-compose.prod.yml up --build
```

## PocketBase Migrations

Migrations are stored in `pocketbase/pb_migrations` and are included in the repository. The actual database data is stored in `pocketbase/pb_data` but is excluded from the repository.

## Python Backend

The backend uses FastAPI and is integrated with LangChain and LangGraph for intelligent mail processing.

## Qdrant (Vector Database)

Qdrant is used for storing and searching vector embeddings. Persistent data is stored in `qdrant/storage` (git-ignored). Collections are automatically initialized on startup based on JSON definitions in `qdrant/collections`.

### Security

Qdrant is secured with API key authentication. The key is managed via the `QDRANT_API_KEY` environment variable in the root `.env` file.
