# Component Specifications

This folder defines frontend contracts only. No component in this document should make API calls directly; data fetching and orchestration stay in page-level containers or hooks implemented later.

## Shared Types

- `DateRangeFilter` from `param-types.ts`
- `FacetsResponse` from `api-types.ts`
- `AlertsParams` from `param-types.ts`
- `AlertsResponse` from `api-types.ts`
- `TopCategoriesParams` from `param-types.ts`
- `TopCategoriesResponse` from `api-types.ts`

## Feature 1: Home Dashboard Date Range Controls

### `DashboardDateRangeSection`

Purpose: renders the start and end date inputs at the top of the home dashboard and shows the available dataset bounds.

Props:

- `value: DateRangeFilter`
- `availableRange: Pick<FacetsResponse, 'min_date' | 'max_date'> | null`
- `isLoadingRange: boolean`
- `validationMessage: string | null`
- `onChange: (nextValue: DateRangeFilter) => void`
- `onApply: (nextValue: DateRangeFilter) => void`
- `onClear: () => void`

Conditional rendering:

- Always render both date inputs, even when both values are empty.
- When `availableRange` is present, render helper text in the format `Available data: {min_date} to {max_date}`.
- When `isLoadingRange` is `true`, render a non-blocking loading placeholder where the helper text will appear.
- When only `start_date` is filled, apply a lower-bound-only filter.
- When only `end_date` is filled, apply an upper-bound-only filter.
- When `start_date` is later than `end_date`, render `validationMessage`, do not apply the filter, and keep the current dashboard data visible.

### `DashboardDateInput`

Purpose: reusable labeled date field used for both `start_date` and `end_date`.

Props:

- `label: 'Start date' | 'End date'`
- `name: 'start_date' | 'end_date'`
- `value: string`
- `min?: string`
- `max?: string`
- `onChange: (value: string) => void`

Conditional rendering:

- Render an empty input value when the corresponding filter field is omitted.
- Respect `min` and `max` from the available dataset range when supplied.

### `FilteredDashboardContent`

Purpose: wrapper contract for the existing KPI and chart area once date filters are active.

Props:

- `filter: DateRangeFilter`
- `isRefreshing: boolean`
- `children: React.ReactNode`

Conditional rendering:

- Keep existing dashboard content mounted while refreshed data is loading.
- If the filtered response contains no records, render the existing KPI/chart layout with an explicit `No data in selected range` empty state instead of removing the section.

## Feature 2: Anomaly Alerts Table

### `AnomalyAlertsSection`

Purpose: owns the threshold control, section heading, and anomaly table below the existing charts.

Props:

- `filter: DateRangeFilter`
- `threshold: number`
- `alerts: AlertsResponse | null`
- `isLoading: boolean`
- `errorMessage: string | null`
- `onThresholdChange: (value: number) => void`
- `onRetry: () => void`

Conditional rendering:

- Always render the numeric threshold input.
- When `isLoading` is `true`, render the section shell and a loading state for the table body.
- When `errorMessage` is present, render an inline error state with retry action.
- When `alerts` is an empty array, render the dedicated empty state message instead of hiding the section.

### `AlertThresholdInput`

Purpose: numeric input that controls the `threshold` query parameter.

Props:

- `value: number`
- `min: 0.01`
- `max: 1`
- `step: 0.01`
- `defaultValue: 0.3`
- `onChange: (value: number) => void`

Conditional rendering:

- Clamp or reject values outside the 0.01 to 1.0 range before request submission.
- Preserve the previous valid threshold if the user enters an invalid number.

### `AnomalyAlertsTable`

Purpose: displays anomaly rows using the backend payload.

Props:

- `rows: AlertsResponse`

Columns:

- `period: string`
- `outcome_total: number`
- `baseline_average: number` rendered with the column label `Rolling average of previous 3 periods`
- `increase_ratio: number`

Conditional rendering:

- Format `outcome_total` and `baseline_average` as currency.
- Use the backend `baseline_average` field as the source value for the `Rolling average of previous 3 periods` column label required by the product spec.
- Format `increase_ratio` as a percentage by multiplying the ratio by 100 for display.
- Preserve table headers when `rows` is empty and delegate the body to the empty-state component.

### `AnomalyAlertsEmptyState`

Purpose: explicit fallback for a valid request that returns no anomaly rows.

Props:

- `threshold: number`
- `filter: DateRangeFilter`

Rendered copy requirement:

- Message must explicitly state that no anomalies were detected for the current threshold and date range.

## Feature 3: B2B vs B2C Comparison View

### `RevenueComparisonPage`

Purpose: page-level container for the business-line comparison experience.

Props:

- `filter: DateRangeFilter`
- `availableRange: Pick<FacetsResponse, 'min_date' | 'max_date'> | null`
- `availableCategories: FacetsResponse['categories']`
- `b2bCategories: TopCategoriesResponse | null`
- `b2cCategories: TopCategoriesResponse | null`
- `isLoading: boolean`
- `errorMessage: string | null`
- `onFilterChange: (nextValue: DateRangeFilter) => void`
- `onRetry: () => void`

Conditional rendering:

- Render both business-line panels side by side on desktop and stacked on smaller screens.
- Keep the filter controls visible while panel data is loading.
- If one panel has data and the other is empty, render both panels and show the empty state only in the empty panel.
- If both panels are empty, render both empty states and still render the comparison chart area with zero totals.

### `ComparisonDateRangeSection`

Purpose: date filter controls for the B2B vs B2C page.

Props:

- `value: DateRangeFilter`
- `availableRange: Pick<FacetsResponse, 'min_date' | 'max_date'> | null`
- `validationMessage: string | null`
- `onChange: (nextValue: DateRangeFilter) => void`
- `onApply: (nextValue: DateRangeFilter) => void`
- `onClear: () => void`

Conditional rendering:

- Match the same partial-date behavior as Feature 1.
- When `validationMessage` is present, render it inline near the date inputs and do not submit a new request.
- Show the same inline validation when `start_date` is later than `end_date`.

### `BusinessLineTopCategoriesPanel`

Purpose: renders one top-5 table for either B2B or B2C income categories.

Props:

- `businessType: 'B2B' | 'B2C'`
- `rows: TopCategoriesResponse`
- `availableCategories: FacetsResponse['categories']`
- `isLoading: boolean`

Columns:

- `category: string`
- `total_amount: number`
- `share_of_group_total: number`

Conditional rendering:

- Show only up to 5 rows because `limit` is fixed to 5.
- Compute `share_of_group_total` in the UI as `row.total_amount / sum(rows.total_amount)`.
- When `rows` is empty, render table headers plus an empty-state message for that business line.
- If a category exists in `availableCategories` but not in `rows`, do not render a placeholder row for it.

### `BusinessLineTopCategoriesEmptyState`

Purpose: explicit empty state for a comparison panel with no top-category rows.

Props:

- `businessType: 'B2B' | 'B2C'`
- `filter: DateRangeFilter`

Rendered copy requirement:

- Message must explicitly state that no income categories were returned for the selected business line and date range.

### `BusinessLineIncomeComparisonChart`

Purpose: visual comparison of total income between B2B and B2C based on the same top-category responses shown above.

Props:

- `b2bRows: TopCategoriesResponse`
- `b2cRows: TopCategoriesResponse`
- `isLoading: boolean`

Derived values:

- `b2bTotal = sum(b2bRows.total_amount)`
- `b2cTotal = sum(b2cRows.total_amount)`

Conditional rendering:

- Render a two-series comparison using the derived totals.
- When one side has no rows, render that side as zero.
- When both sides have no rows, render a zero-state chart or chart placeholder with explanatory copy instead of removing the visualization.