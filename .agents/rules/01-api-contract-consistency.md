# Rule 01 - API Contract Consistency

## Scope
Applies to all backend endpoint payload changes and frontend financial type changes.

## Rule
Whenever a backend response field, enum value, or endpoint query behavior changes, update the corresponding frontend type definitions and usage paths in the same change set.

## Required checks
1. Keep backend domain values aligned with frontend unions and interfaces.
2. Verify endpoint payload shape assumptions used by UI logic.
3. Add or update tests that protect the changed contract.

## Why this exists
The backend and frontend are typed independently, so contract drift can happen silently without explicit synchronization.

## Repository anchors
- backend/app/routes.py
- frontend/src/lib/financial-types.ts
- frontend/src/App.tsx
