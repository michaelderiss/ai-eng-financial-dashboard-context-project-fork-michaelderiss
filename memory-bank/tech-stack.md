# Tech Stack

## Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Lucide React
- Vitest for unit testing
- ESLint with typescript-eslint and React plugins

## Backend
- Python 3.13 (container base)
- FastAPI
- Uvicorn
- Pydantic models
- pytest + FastAPI TestClient + httpx
- debugpy for debug workflows

## Infrastructure and local runtime
- Docker Compose orchestrates frontend and backend.
- Service ports:
  - Frontend: 5173
  - Backend API: 8000
  - Backend debug: 5678
- Vite proxy forwards /api traffic to backend in local compose runs.

## Key project-level conventions
- Frontend import alias @ points to frontend/src.
- Backend exposes typed API responses through route models.
- No persistent storage layer is configured in current codebase.
