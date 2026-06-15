# Rule 03 - Deterministic Data and Date Logic

## Scope
Applies to mock data generation, period grouping, and date range comparison behavior.

## Rule
Keep mock data deterministic in local development and tests, and document any date logic changes that affect period interpretation.

## Required checks
1. Preserve deterministic seed behavior unless intentionally migrating away from mock mode.
2. Validate summary/comparison outputs when date grouping logic changes.
3. Update status documentation if temporal assumptions change.

## Why this exists
The project currently relies on deterministic generated data for stable validation across environments.

## Repository anchors
- backend/app/routes.py
- backend/tests/test_routes.py
