# MyMailAssistant

A modern web application for mail assistance, built with Next.js, PocketBase, and FastAPI.

## Project Structure

- `frontend/`: Next.js application (Typescript, Tailwind CSS, Shadcn UI).
- `pocketbase/`: PocketBase backend (Auth & Database).
- `backend/`: Python backend (FastAPI, LangChain, LangGraph).

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

### Production

To start the application in production mode:

```bash
docker compose -f docker-compose.prod.yml up --build
```

## PocketBase Migrations

Migrations are stored in `pocketbase/pb_migrations` and are included in the repository. The actual database data is stored in `pocketbase/pb_data` but is excluded from the repository.

## Python Backend

The backend uses FastAPI and is integrated with LangChain and LangGraph for intelligent mail processing.