# Frontend Specs

This directory is specification-only. It documents the request contracts, response contracts, and UI behavior for the next frontend phase. It does not implement React components or API calls.

## Feature 1: Home Dashboard Date Range Filter

Endpoints consumed:

- `GET /api/metrics/facets`
- `GET /api/metrics` with optional `start_date` and `end_date`

Types:

- Facets response: `FacetsResponse`
- Filter params: `DateRangeFilter`
- Existing dashboard data payload: `FinancialMovement[]` from `frontend/src/lib/financial-types.ts`

Valid parameters and constraints:

- `start_date?: string` in `YYYY-MM-DD` format
- `end_date?: string` in `YYYY-MM-DD` format
- Both dates are optional.
- Dates are inclusive because backend filtering uses `>= start_date` and `<= end_date`.
- The UI must fetch `FacetsResponse` to display the valid dataset range using `min_date` and `max_date`.

UI rules:

- Render two date inputs at the top of the home dashboard.
- Keep the available dataset range visible near the inputs.
- Apply the same `DateRangeFilter` to every existing home-dashboard dataset request.
- Do not remove the dashboard when a valid filter returns no records; show an explicit `No data in selected range` state.

Edge cases:

- If both dates are empty, the UI must omit both query params and show all available data.
- If only `start_date` is filled, the UI must send only `start_date` and show data from that date forward.
- If only `end_date` is filled, the UI must send only `end_date` and show data up to that date.
- If `start_date > end_date`, the UI must show inline validation and must not submit a new request.

## Feature 2: Anomaly Alerts Table

Endpoint consumed:

- `GET /api/metrics/alerts`

Types:

- Request params: `AlertsParams`
- Response payload: `AlertsResponse`
- Row type: `AlertEntry`

Valid parameters and constraints:

- `threshold: number`
- UI must constrain `threshold` to `0.01` through `1.0` inclusive.
- Backend default threshold is `0.3`.
- `start_date?: string` in `YYYY-MM-DD` format
- `end_date?: string` in `YYYY-MM-DD` format
- The feature must rely on the endpoint default grouping behavior and does not introduce a `group_by` control.

Response contract notes:

- `increase_ratio` is a ratio, not a percentage string. The UI must multiply by 100 for percentage display.
- `baseline_average` is the backend-provided comparison baseline. The current payload does not expose metadata proving that the baseline is limited to the previous 3 periods, so the frontend must treat it as an opaque backend-calculated average.

UI rules:

- Place the anomaly table below the existing charts on the home dashboard.
- Always render the threshold input and the table shell.
- The table columns are `period`, `recorded outcome`, `baseline average`, and `percentage increase`.
- The table must respect the same `DateRangeFilter` used by Feature 1.
- If the response is empty, render an explicit empty-state message and keep the section visible.

Edge cases:

- If the current threshold and date range return an empty array, the UI must show `No anomalies detected for the current threshold and date range.`
- If the user enters a threshold outside `0.01` to `1.0`, the UI must block submission or clamp to the nearest valid value and preserve the previous valid request state.
- If the date filter leaves too little historical data for anomaly detection, the UI must still render the section and fall back to the same explicit empty-state message.
- If only one date is filled, the UI must send the partial date range exactly as in Feature 1.

## Feature 3: B2B vs B2C Comparison View

Endpoints consumed:

- `GET /api/metrics/categories/top`
- `GET /api/metrics/facets`

Types:

- Request params per panel: `TopCategoriesParams`
- Top-categories response: `TopCategoriesResponse`
- Row type: `CategoryEntry`
- Facets response: `FacetsResponse`

Valid parameters and constraints:

- `business_type: 'B2B' | 'B2C'`
- `operation_type: 'income'`
- `limit: 5`
- `start_date?: string` in `YYYY-MM-DD` format
- `end_date?: string` in `YYYY-MM-DD` format
- Although the backend endpoint accepts other operation types and `limit` values from `1` to `20`, this comparison feature must always request `income` and `5`.
- The available categories reference must come from `FacetsResponse.categories`.

UI rules:

- Create a separate comparison page rather than placing this view on the home dashboard.
- Render two side-by-side sections, one for `B2B` and one for `B2C`.
- Each section shows a top-5 table with category name, total income, and percentage of that business line's displayed total.
- Compute percentage of group total in the UI from the `total_amount` values returned for that business line.
- Render a single comparison chart below both sections using the total displayed income for `B2B` versus `B2C`.

Edge cases:

- If the `B2B` request returns an empty array, the `B2B` panel must render table headers plus an explicit empty-state message while the `B2C` panel continues to render normally.
- If the `B2C` request returns an empty array, the `B2C` panel must render table headers plus an explicit empty-state message while the `B2B` panel continues to render normally.
- If both panels are empty for the selected date range, both empty states must render and the comparison chart must remain visible with zero totals or a zero-state placeholder.
- If only one date is filled, both panel requests must receive the same partial date range.

## Implementation Boundary

The current task ends with these specification artifacts:

- `frontend/specs/api-types.ts`
- `frontend/specs/param-types.ts`
- `frontend/specs/components.md`
- `frontend/specs/README.md`

No React components, routes, hooks, or API clients should be implemented in this phase.