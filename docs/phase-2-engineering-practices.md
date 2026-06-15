# Phase 2 - Engineering Practices Analysis

## Objective
Identify strong and weak engineering practices from the existing repository, grouped by category, and propose a practical ruleset to guide future contributions.

## Good practices (evidence-based)

### Architecture
1. Backend route handlers rely on reusable helper functions for filtering, summarizing, and comparisons instead of embedding all logic directly in endpoints.
Evidence:
- backend/app/routes.py

2. Frontend separates domain computation logic from UI components.
Evidence:
- frontend/src/lib/financial-utils.ts
- frontend/src/components/dashboard/kpi-row.tsx

### Type safety and contracts
3. Backend endpoint payloads are constrained with Pydantic models and typed Literal values for domain enums.
Evidence:
- backend/app/routes.py

4. Frontend uses explicit union and interface typing for financial movement and KPI structures.
Evidence:
- frontend/src/lib/financial-types.ts

### Testability and determinism
5. Backend mock generation is deterministic in route usage (seed=42), which stabilizes local checks and tests.
Evidence:
- backend/app/routes.py
- backend/tests/test_routes.py

6. Frontend utility logic has unit tests for KPI calculations, date aggregation, and formatters.
Evidence:
- frontend/src/lib/financial-utils.test.ts

### Developer experience
7. Frontend includes lint, test, watch, and coverage scripts with a modern Vite + TypeScript toolchain.
Evidence:
- frontend/package.json

8. Local full-stack startup is straightforward via Docker Compose and service ports are documented.
Evidence:
- docker-compose.yml
- README.md

## Bad or risky practices (evidence-based)

### Security and runtime hardening
1. Backend CORS policy is fully permissive while allowing credentials, which is unsafe outside local/dev contexts.
Evidence:
- backend/app/main.py

### Contract drift and integration risk
2. Frontend consumes only /api/metrics even though backend exposes multiple analytics endpoints; there is no integration contract test between frontend and backend.
Evidence:
- frontend/src/App.tsx
- backend/app/routes.py

### Testing gaps
3. Backend tests do not currently focus on negative path validation such as malformed date range semantics or invalid combinations beyond framework-level validation.
Evidence:
- backend/tests/test_routes.py

4. Frontend lacks component-level tests for loading, empty-data, and error UI states.
Evidence:
- frontend/src/App.tsx
- frontend/src/components/dashboard/income-outcome-chart.tsx

### Documentation and governance
5. Prior to this phase workflow, governance artifacts were missing for explicit contributor rules and operational memory ownership.
Evidence:
- Context.md
- AGENTS.md

### Domain consistency and data behavior clarity
6. Date/year behavior in mock data generation may be non-obvious for contributors and can affect interpretation of monthly comparisons if undocumented.
Evidence:
- backend/app/routes.py

## Proposed ruleset for next phase
1. Keep backend domain literals/models and frontend financial types synchronized on every domain change.
2. Require tests for every behavior change in both touched layers.
3. Preserve deterministic mock behavior unless intentionally migrating to real persistence.
4. Enforce environment-safe runtime config (especially CORS and API base/proxy behavior).
5. Require maintenance updates to governance artifacts when architecture, behavior, or dependencies change.

## Why this ruleset fits this repository
- It preserves what is already working well (typed contracts, helper-based backend logic, utility tests, deterministic data generation).
- It addresses concrete risks found in the current implementation without forcing a broad refactor.
- It is directly actionable in the existing FastAPI + React + Docker workflow.
