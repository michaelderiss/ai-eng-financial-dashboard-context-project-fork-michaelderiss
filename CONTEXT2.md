Applying Spec Driven Development - Financial dashboard

🎯 Challenge

The financial dashboard you built recently is now in the hands of the client's finance team, and they have feedback. They want more control over the data they see, a way to spot unusual spending without digging through rows, and a dedicated view to compare revenue across their two business lines.

Before anyone builds a single component, your tech lead has stopped the team: "We spec first. Then we build."

A well-written specification defines what the user sees, what data each component needs, and what rules govern every field. If the spec is clear, any developer — or AI coding agent — can implement it correctly without asking you questions. Your job is to produce that spec for three concrete features.

Start by opening /docs in your browser with the backend running. Read the response shapes and parameter rules of the relevant endpoints before writing any type or component description. Your specs must match what the API actually returns.

The finance team wants to focus on specific periods without seeing all historical data at once. Add two date inputs to the top of the home dashboard — a start date and an end date — that filter all the data currently displayed on the page. Dates are sent to the API in YYYY-MM-DD format. Both inputs are optional: when empty, the dashboard shows all available data. The available date range (earliest and latest dates in the dataset) must be shown near the inputs as a reference so the user knows what range is valid.

Relevant endpoint: GET /api/metrics/facets (to retrieve the available date range) and the filters extension on the existing metrics endpoint.

Feature 2 — Anomaly alerts table on the home dashboard

Below the existing charts, add a table that highlights periods where spending spiked unexpectedly. The table has four columns: period, recorded outcome, rolling average of the previous 3 periods, and the percentage increase. The spike threshold is configurable by the user via a numeric input (a ratio between 0.01 and 1.0, defaulting to 0.3). If no anomalies are detected for the current threshold, the table must show an explicit empty state message — not just disappear. The table must also respect the date range set in Feature 1 if active.

Relevant endpoint: GET /api/metrics/alerts?threshold=<ratio>

Feature 3 — B2B vs B2C comparison view

Create a new page in the dashboard for comparing revenue performance between the two business lines: B2B and B2C. The view has two sections side by side. Each section shows a table with the top 5 income categories for that business line, displaying category name, total income, and percentage of the group total. Below both sections, a single chart compares the total income of B2B against B2C visually. The user can filter the comparison by a date range (same YYYY-MM-DD format). The available categories for each group must come from the facets endpoint.

Relevant endpoints:
GET /api/metrics/categories/top?operation_type=income&limit=5
and
GET /api/metrics/facets

Your specifications must be precise enough that a developer — or an AI agent — can build each feature from them alone, without asking you any questions.

🌱 How to Start the Project

This project continues in the same repository you used for the financial dashboard. Do not fork a new repo.

1. Open your existing financial dashboard repository (your fork of ai-eng-financial-dashboard-context-project) in GitHub Codespaces or clone it locally.
2. Create a new branch called feature/frontend-specs from your current main.
3. Create a folder called frontend/specs/ — all your specification files go here.
4. Start the backend and visit /docs to explore the endpoints before writing any spec.

If you need a reminder on branching: how to start a coding project.

💻 What You Need to Do

TypeScript Types

Create frontend/specs/api-types.ts with TypeScript interfaces for the API responses used by the three features:

- FacetsResponse — used by the date range reference and by the B2B vs B2C view
- AlertEntry, AlertsResponse — used by the anomaly table
- CategoryEntry, TopCategoriesResponse — used by the B2B vs B2C comparison table

Create frontend/specs/param-types.ts with TypeScript types for the query parameters sent by each feature:

- DateRangeFilter — the optional start/end date params shared across features (dates as string in YYYY-MM-DD format)
- AlertsParams — threshold plus the date range filter
- TopCategoriesParams — operation type, limit, and the date range filter

All types must use strict TypeScript — no any, no object.

Document every property with a JSDoc comment explaining its meaning, valid values, and format where applicable.

Component Specifications

Create frontend/specs/components.md with the component breakdown for each feature.

Data Contract Documentation

Create frontend/specs/README.md documenting the three features:

- Which endpoint(s) each feature consumes (verify paths against /docs)
- The TypeScript types used for each request and response
- Valid values and constraints for every parameter
- At least 2 edge cases per feature and what the UI must show in each case

⚠️ IMPORTANT: You are specifying the frontend layer, not implementing it. Do not build React components or make API calls. Your deliverables are TypeScript types, components.md, and frontend/specs/README.md.

✅ What We Will Evaluate

- All response interfaces match the shapes returned by the API (verifiable via /docs), without using any.
- DateRangeFilter is defined with both fields optional and typed as string with a YYYY-MM-DD JSDoc annotation.
- AlertsParams and TopCategoriesParams extend or include DateRangeFilter.
- components.md names every component, lists its props with types, and specifies conditional rendering for each feature.
- The empty state of the anomaly alerts table is explicitly specified.
- The behavior when only one date input is filled in is explicitly specified.
- Both panels of the B2B vs B2C view specify what renders when their top-5 list is empty.
- frontend/specs/README.md covers all three features with endpoints, types, valid parameters, and at least 2 edge cases each.
- TypeScript compiles without errors (npx tsc --noEmit).
- Code is committed on a branch called feature/frontend-specs with meaningful commit messages.

Note: React components, API calls, and backend implementation are not evaluated in this project.

📦 How to Submit

Push your feature/frontend-specs branch to GitHub and share the repository URL with your instructor as indicated in class. Make sure the frontend/specs/ folder is present and your branch is visible.
