# Phase 3 - Rule Validation

## Validation approach
Each rule was validated against real repository workflows and code touchpoints to ensure it can guide daily changes.

## Rule-by-rule validation

### Rule 01 - API Contract Consistency
- Applicable when editing backend/app/routes.py or frontend/src/lib/financial-types.ts.
- Practical outcome: prevents backend/frontend contract drift during endpoint or enum changes.

### Rule 02 - Behavior Change Test Requirement
- Applicable when route filtering logic or financial utility logic changes.
- Practical outcome: enforces test updates in backend/tests/test_routes.py and frontend/src/lib/financial-utils.test.ts.

### Rule 03 - Deterministic Data and Date Logic
- Applicable when modifying generate_mock_movements, grouping, alerts, or comparison behavior.
- Practical outcome: keeps outputs stable and reviewable across local runs.

### Rule 04 - Runtime Config and Safety
- Applicable when touching CORS, Vite proxy, API base URLs, or docker-compose connectivity.
- Practical outcome: protects local DX while signaling security implications for non-local environments.

### Rule 05 - Governance and Documentation Maintenance
- Applicable on meaningful behavior or architecture changes.
- Practical outcome: keeps contributor context current and avoids stale operational docs.

## Refinement notes
1. Rules were intentionally scoped to this FastAPI + React + Docker setup.
2. Each rule references concrete repository files to avoid ambiguity.
3. Rules are phrased as checks contributors can execute during normal PR work.
