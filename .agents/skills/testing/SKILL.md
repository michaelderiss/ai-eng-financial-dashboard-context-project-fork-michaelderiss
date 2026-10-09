---
name: testing
description: Comprehensive testing guidelines for full-stack React/Vite + Python FastAPI projects. Use when asked to "add tests", "write tests", "improve test coverage", "set up testing", "fix failing tests", "add unit tests", "add integration tests", "add component tests", or "test the application".
---

# Testing Guidelines

Comprehensive testing strategy for the financial dashboard (React 19.2.4 + Vite 8.x + Tailwind CSS v4 frontend, Python FastAPI backend). Covers Vitest 4.x for frontend, pytest + httpx for backend, and Playwright for E2E.

## Testing Stack

| Layer | Tool | Config |
|-------|------|--------|
| Frontend — Unit/Integration | **Vitest** 4.x (via `@vitest/coverage-v8`) | Uses Vite config; no separate vitest.config needed |
| Frontend — Component | **React Testing Library** + `@testing-library/react` | Renders React components, queries by role/text |
| Frontend — E2E | **Playwright** (optional) | Browser-level tests |
| Backend — API | **pytest** + **httpx** (FastAPI TestClient) | Tests in `backend/tests/` |
| Backend — Coverage | **pytest-cov** | Measures backend coverage |

## Quick Reference

```bash
# Frontend
npm run test          # vitest run (single run)
npm run test:watch    # vitest (watch mode)
npm run test:coverage # vitest run --coverage

# Backend
cd backend && python -m pytest          # run all
cd backend && python -m pytest -v       # verbose
cd backend && python -m pytest --cov    # with coverage
cd backend && python -m pytest -k "b2b" # filter by name
```

## File Layout

```
frontend/src/lib/
  financial-utils.test.ts      # ✅ EXISTS — unit tests for computeKPIs, computeMonthlyData, formatters
  # Add new tests alongside source files (*.test.ts next to *.ts)

backend/tests/
  conftest.py                   # ✅ EXISTS — sys.path setup for imports
  test_routes.py                # ✅ EXISTS — API integration tests via TestClient

# Future:
frontend/src/components/dashboard/
  __tests__/                    # Component tests for dashboard components
```

## 1. Frontend — Unit Tests (Vitest)

### Patterns to Follow

Use the **existing** `financial-utils.test.ts` as the canonical example:

```ts
import { describe, expect, it } from "vitest";
import { computeKPIs, formatCurrency } from "./financial-utils";
import type { FinancialMovement } from "./financial-types";

const sampleMovements: FinancialMovement[] = [
  {
    create_date: "2024-01-10",
    amount: 1000,
    operation_type: "income",
    category: "sales",
    business_type: "B2B",
  },
  // ...
];

describe("computeKPIs", () => {
  it("calculates totals and profit values", () => {
    const metrics = computeKPIs(sampleMovements);
    expect(metrics).toEqual({
      totalIncome: 1500,
      totalOutcome: 250,
      profit: 1250,
      profitPercent: (1250 / 1500) * 100,
    });
  });

  it("returns 0 profitPercent when there is no income", () => {
    // Edge case test
  });
});
```

### Vitest-Specific Conventions

- **Use `describe`/`it`/`expect` from vitest** (not jest/globals). Always import explicitly: `import { describe, expect, it } from "vitest"`
- **Prefer `toEqual()` over `toBe()` for objects** (`toBe()` uses `Object.is`, `toEqual()` does deep comparison)
- **Use `toHaveLength(n)`** for array length assertions
- **Use `toBe(0)` for zero values** (avoids falsy pitfalls)
- **No `vitest.config.ts` needed** — Vitest 4.x picks up Vite config automatically

### Mock Data

Use `mock-data.ts` for reusable test fixtures. Prefer importing specific data over constructing ad-hoc arrays in each test. When tests need specific scenarios, construct minimal test data inline:

```ts
const minimalMovement: FinancialMovement[] = [
  { create_date: "2024-06-01", amount: 500, operation_type: "income",
    category: "sales", business_type: "B2B" },
];
```

## 2. Frontend — Component Tests (React Testing Library)

### Setup

Install React Testing Library for component-level tests:

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Vitest Configuration for Component Tests

Extend the Vitest config in `vite.config.ts` or a dedicated `vitest.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
// ...

export default defineConfig({
  // ... existing config ...
  test: {
    environment: "node",              // or "jsdom" for DOM-dependent components
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",                 // @vitest/coverage-v8 is already installed
      include: ["src/lib/**", "src/components/**"],
      exclude: ["src/**/*.test.ts", "src/lib/mock-data.ts"],
    },
  },
});
```

### Component Test Patterns

```ts
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPICard } from "./kpi-card";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign";

describe("KPICard", () => {
  it("renders the label and formatted value", () => {
    render(
      <KPICard
        label="Total Income"
        value="$48,200"
        helperText="Cumulative revenue"
        icon={DollarSign}
        variant="income"
      />
    );

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("$48,200")).toBeInTheDocument();
  });

  it("renders skeleton placeholders when loading", () => {
    render(
      <KPICard
        label="Total Income"
        value="—"
        helperText=""
        icon={DollarSign}
        variant="income"
        loading={true}
      />
    );

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    // Skeleton elements should be rendered instead of value
  });
});
```

### Accessibility Assertions in Tests

Always include accessibility checks in component tests:

```ts
it("has accessible icon element", () => {
  render(<KPICard ... />);
  // Icons should have aria-hidden="true" when decorative
  // Verify via querySelector or data-testid
});
```

### Recharts Rendering in Tests

Recharts components render SVG. For tests, verify data is passed correctly rather than asserting SVG output:

```ts
it("passes monthly data to the chart", () => {
  render(<IncomeOutcomeChart data={monthlyData} />);
  // Check that chart labels appear in the rendered output
  expect(screen.getByText("Jan 2024")).toBeInTheDocument();
});
```

## 3. Backend — API Tests (pytest + httpx)

### Patterns to Follow

Use the **existing** `test_routes.py` as the canonical example:

```python
from fastapi.testclient import TestClient
from app.main import app
from app.routes import generate_mock_movements

client = TestClient(app)


def test_generate_mock_movements_returns_full_year_sorted_data():
    movements = generate_mock_movements(seed=42)
    assert len(movements) == 360
    assert movements == sorted(movements, key=lambda item: item.create_date)


def test_health_endpoint_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_metrics_endpoint_respects_date_filters():
    base_response = client.get("/api/metrics")
    first_date = base_response.json()[0]["create_date"]
    response = client.get(
        "/api/metrics",
        params={"start_date": first_date, "end_date": first_date},
    )
    assert response.status_code == 200
    payload = response.json()
    assert all(item["create_date"] == first_date for item in payload)
```

### Backend-Specific Conventions

- **Use `TestClient` as a context manager** for FastAPI lifespan events: `with TestClient(app) as client:`
- **Prefer deterministic seeds** (`seed=42`) to make tests reproducible
- **Test filtering, sorting, and edge cases** (empty results, boundary dates, invalid inputs)
- **Use `pytest-cov`** to measure coverage: `python -m pytest --cov=app --cov-report=term-missing`
- **Fixtures** in `conftest.py` should be scoped appropriately (`function` scope by default)

### Conftest Patterns

Current `conftest.py` handles path setup. Extend with shared fixtures:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def seeded_movements():
    from app.routes import generate_mock_movements
    return generate_mock_movements(seed=42)
```

## 4. Frontend E2E Tests (Playwright)

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

### E2E Test Patterns

```ts
import { test, expect } from "@playwright/test";

test("dashboard loads and displays KPIs", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page.getByText("Total Income")).toBeVisible();
  await expect(page.getByText("Total Outcome")).toBeVisible();
});
```

## 5. Coverage Requirements

| Metric | Target | Tool |
|--------|--------|------|
| Backend API routes | ≥ 90% line coverage | pytest-cov |
| Frontend utility functions | ≥ 90% branch coverage | @vitest/coverage-v8 |
| Frontend component rendering | ≥ 80% line coverage (future) | @vitest/coverage-v8 |
| E2E critical paths | All critical user flows | Playwright |

## 6. CI Integration

When adding to CI workflows:

```yaml
# Frontend
- name: Run frontend tests
  run: npm run test

# Backend
- name: Run backend tests
  run: python -m pytest --cov=app --cov-fail-under=90
```

## 7. When to Write What

| Change | Test Type | Priority |
|--------|-----------|----------|
| New utility function (e.g., `computeMonthlyData`) | Unit test (Vitest) | Required |
| New API endpoint | Integration test (pytest + httpx) | Required |
| New React component | Component test (RTL) | High |
| Bug fix | Regression test matching the bug scenario | Required |
| Chart/rendering change | Visual/E2E test (Playwright) | Nice to have |
| Data factory change | Verify raw output matches schema | Recommended |

## 8. Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| ❌ Using `toBeTruthy()`/`toBeFalsy()` on numeric values | ✅ Use `toBe(0)` or `toBeGreaterThan(0)` |
| ❌ Sharing mutable test data between tests | ✅ Use factory functions or `beforeEach` |
| ❌ Asserting on recharts SVG internals (fragile) | ✅ Assert on text labels and data attributes |
| ❌ Forgetting `await` for async vitest tests | ✅ `it("handles async", async () => { await ... })` |
| ❌ Hard-coding dates in assertions | ✅ Use the same deterministic seed/mock data |
| ❌ Mixing Vitest globals with explicit imports | ✅ Always `import { describe, expect, it } from "vitest"` (no globals) |
| ❌ Testing `catch` blocks by throwing in mocks | ✅ Use `vi.spyOn(obj, 'method').mockRejectedValue(err)` |

## 9. Vitest Mocking

Use Vitest's `vi` for mocking:

```ts
import { describe, expect, it, vi } from "vitest";

it("handles API errors gracefully", async () => {
  const mockFetch = vi.spyOn(globalThis, "fetch");
  mockFetch.mockRejectedValue(new Error("Network error"));

  // ... test error handling ...
  mockFetch.mockRestore();
});
```

## 10. Running Tests in CI

Add to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test:coverage

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.13" }
      - run: cd backend && pip install -r requirements.txt
      - run: cd backend && python -m pytest --cov=app --cov-fail-under=90
```