# Rule 04 - Runtime Config and Safety

## Scope
Applies to CORS settings, frontend API base behavior, Vite proxy config, and docker-compose service connectivity.

## Rule
Maintain local developer connectivity while preventing unsafe runtime defaults from being promoted to non-local environments.

## Required checks
1. Frontend must continue to reach backend in the default local workflow.
2. CORS changes must be explicitly reviewed for deployment safety.
3. API base URL and proxy behavior changes must be documented.

## Why this exists
The repo uses permissive local defaults and proxy-based routing that are convenient for development but need discipline for broader environments.

## Repository anchors
- backend/app/main.py
- frontend/vite.config.ts
- frontend/src/App.tsx
- docker-compose.yml
