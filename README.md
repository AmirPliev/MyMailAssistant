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

- Frontend: [http://localhost:8200](http://localhost:8200)
- PocketBase Admin: [http://localhost:8202/_/](http://localhost:8202/_/)
- Backend API: [http://localhost:8201/docs](http://localhost:8201/docs)
- Qdrant Dashboard: [http://localhost:8203/dashboard](http://localhost:8203/dashboard)

### Production

To start the application in production mode:

```bash
docker compose -f docker-compose.prod.yml up --build
```

## Deployment

This project uses GitHub Actions for CI/CD. When code is pushed to the `main` branch, it automatically builds Docker images and deploys them to a VPS.

### Required GitHub Secrets

To enable the deployment pipeline, configure the following secrets in your GitHub repository:

- `DOCKER_USERNAME`: Your DockerHub username.
- `DOCKER_PASSWORD`: Your DockerHub password or personal access token.
- `VPS_HOST`: The IP address or hostname of your VPS.
- `VPS_SSH_KEY`: A private SSH key for accessing the VPS.

## PocketBase Migrations

Migrations are stored in `pocketbase/pb_migrations` and are included in the repository. The actual database data is stored in `pocketbase/pb_data` but is excluded from the repository.

## Python Backend

The backend uses FastAPI and is integrated with LangChain and LangGraph for intelligent mail processing.

## Qdrant (Vector Database)

Qdrant is used for storing and searching vector embeddings. Persistent data is stored in `qdrant/storage` (git-ignored). Collections are automatically initialized on startup based on JSON definitions in `qdrant/collections`.

### Security

Qdrant is secured with API key authentication. The key is managed via the `QDRANT_API_KEY` environment variable in the root `.env` file.
