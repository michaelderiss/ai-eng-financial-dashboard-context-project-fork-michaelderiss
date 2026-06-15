# Rule 02 - Behavior Change Test Requirement

## Scope
Applies to changes in data transformation, route behavior, filtering logic, and UI state behavior.

## Rule
Every behavior change must include test coverage in the same layer where the behavior changed.

## Required checks
1. Backend logic changes require route-level or helper-level test updates.
2. Frontend utility logic changes require utility test updates.
3. If UI behavior changes significantly, add component-level tests where possible.

## Why this exists
The repo already has strong backend route tests and utility tests. This rule preserves and extends that quality baseline.

## Repository anchors
- backend/tests/test_routes.py
- frontend/src/lib/financial-utils.test.ts
