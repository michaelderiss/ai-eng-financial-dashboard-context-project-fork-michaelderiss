---
name: dashboard-ui-conventions
description: Project-specific UI conventions for the financial dashboard — Tailwind CSS v4 patterns, OKLCH color system, Card/Skeleton abstractions, KPI card variants, Recharts chart patterns, icon conventions, and component structure rules. Use when building or reviewing any frontend component, adding CSS, creating new dashboard features, or ensuring consistency with existing UI patterns.
---

# Dashboard UI Conventions

Project-specific design system and UI conventions for the financial dashboard (React 19.2.4 + Tailwind CSS v4 + TypeScript 6.0).

## 1. Tailwind CSS v4 — CSS-First Architecture

The project uses Tailwind CSS v4's CSS-first approach. There is **no `tailwind.config.js`** — all configuration is done through CSS.

### Entry Point (`index.css`)

```css
/* 1. Import Tailwind as the very first rule */
@import "tailwindcss";

/* 2. Optional: dark mode variant */
@custom-variant dark (&:is(.dark *));

/* 3. Theme tokens in :root */
:root {
  --background: oklch(0.97 0.005 240);
  --foreground: oklch(0.15 0.01 240);
  /* ... all other tokens ... */
}

.dark {
  --background: oklch(0.13 0.01 240);
  /* ... dark overrides ... */
}

/* 4. Inline theme with font families and color aliases */
@theme inline {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... color-prefixed aliases for Tailwind arbitrary value support ... */
}

/* 5. Base layer with global resets using @apply */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Key Directives

| Directive | Purpose |
|-----------|---------|
| `@import "tailwindcss"` | Must be the first rule in the file |
| `@custom-variant dark (&:is(.dark *))` | Enables dark mode via class toggle on any ancestor |
| `@theme inline { ... }` | Defines theme-level tokens (fonts, color aliases) |
| `@layer base { ... }` | Global base styles using `@apply` (Tailwind's `@apply` compiles to the equivalent utility classes) |

### CSS Custom Properties vs. Tailwind Utilities

- **Design tokens** (colors, radii) are stored as CSS custom properties on `:root` / `.dark`
- **Layout and spacing** use Tailwind utility classes in JSX (`gap-4`, `p-6`, `mx-auto`)
- **Typography** uses Tailwind utilities (`text-sm`, `text-base`, `text-xl`, `font-semibold`)
- **Color in utility classes** uses OKLCH custom properties directly: `bg-card text-foreground`, `text-muted-foreground`
- **Arbitrary values** (e.g., `bg-[var(--income-badge)]`) are used for dynamic badge colors

## 2. OKLCH Color Token System

All colors use the **OKLCH** color space (`oklch(L C H)`), not hex, RGB, or HSL.

### Token Naming Convention

| Pattern | Example | Purpose |
|---------|---------|---------|
| `--{role}` | `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border` | Core UI surfaces |
| `--{role}-foreground` | `--card-foreground`, `--primary-foreground`, `--muted-foreground`, `--destructive-foreground` | Foreground text on each surface |
| `--chart-{name}` | `--chart-income`, `--chart-outcome`, `--chart-profit` | Chart series colors |
| `--chart-{n}` | `--chart-1` through `--chart-5` | Generic chart palette (aliased by specific chart roles) |
| `--{type}-badge` | `--income-badge`, `--outcome-badge`, `--profit-badge` | KPI card badge backgrounds |
| `--{type}-badge-fg` | `--income-badge-fg`, `--outcome-badge-fg`, `--profit-badge-fg` | KPI card badge foreground (icon) colors |
| `--radius` | `--radius: 0.75rem` | Base radius; computed variants `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` |
| `--color-{name}` | `--color-background`, `--color-border`, `--color-chart-1` | Color alias tokens (inside `@theme inline`) for use with Tailwind's arbitrary value support |

### Dark Mode

The `.dark` class switches **all** surface tokens while keeping chart/badge tokens consistent:

```css
:root {
  --background: oklch(0.97 0.005 240);     /* light */
  --foreground: oklch(0.15 0.01 240);      /* dark text */
  --card: oklch(1 0 0);                     /* white */
  --chart-income: oklch(0.55 0.2 255);     /* blue */
}

.dark {
  --background: oklch(0.13 0.01 240);      /* dark */
  --foreground: oklch(0.94 0.005 240);     /* light text */
  --card: oklch(0.18 0.012 240);           /* dark card */
  --chart-income: oklch(0.62 0.2 255);     /* brighter blue for dark bg */
}
```

### How to Apply

```jsx
{/* Surface color — use bg-{token} / text-{token} */}
<div className="bg-card text-foreground">...</div>

{/* Opacity modifier — use /{opacity} syntax */}
<div className="border border-destructive/30 bg-destructive/10">...</div>

{/* Badge color — use arbitrary value syntax */}
<span className="bg-[var(--income-badge)] text-[var(--income-badge-fg)]">...</span>

{/* Chart stroke — pass CSS variable name as stroke */}
<Line stroke="var(--color-chart-1)" />
```

## 3. Component Architecture

### Props-First Pattern

Every component defines its props interface immediately before the component function:

```tsx
interface KPICardProps {
  label: string
  value: string
  helperText: string
  icon: LucideIcon
  variant: 'income' | 'outcome' | 'profit' | 'profitPercent'
  loading?: boolean
}
```

### Component Export Convention

- Only **named exports** — no `export default`
- Function declaration syntax (not arrow functions for components):

```tsx
export function KPICard({ label, value, ... }: KPICardProps) {
```

### Internal Helper Functions

Inline helper functions (e.g., tooltip renderers) use regular function declarations or arrow functions before the export:

```tsx
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  // ...
}
```

### React Patterns

- Components are **pure functions** — no classes, no `this`
- `useState`, `useEffect` imported directly from `"react"`
- Type imports use the `type` keyword: `import { type X } from '@/...'`
- `StrictMode` wraps the root component in `main.tsx`
- Component props use `React.ComponentProps<'div'>` for generic HTML element extension
- `className` is always the last prop and is merged via `cn()`

### Path Alias

All internal imports use the `@/` path alias (maps to `./src/` in both TypeScript and Vite config):

```tsx
import { cn } from '@/lib/utils'
import { type FinancialMovement } from '@/lib/financial-types'
import { Card } from '@/components/ui/card'
import '@/index.css'  // in main.tsx
```

### Environment Variables

Use `import.meta.env.VITE_*` for environment variables with `??` fallback:

```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
```

## 4. The `cn()` Utility

Used for **all** className merging. Wraps `clsx` + `tailwind-merge`:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Usage patterns:

```tsx
{/* Simple merge */}
<div className={cn('bg-card text-foreground', className)} />

{/* Conditional class */}
<div className={cn('base-class', condition && 'conditional-class')} />

{/* Style map lookup */}
<span className={cn('p-1.5 rounded-lg', styles.badge)} />
```

## 5. Card UI Component System

Four composable card primitives in `src/components/ui/card.tsx`:

| Component | `data-slot` | Base Classes | Role |
|-----------|-------------|--------------|------|
| `Card` | `card` | `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm` | Outermost wrapper |
| `CardHeader` | `card-header` | Grid layout with `@container/card-header` query | Title + description area |
| `CardTitle` | `card-title` | `<h2>` element, `leading-none font-semibold` | Section heading (WCAG heading level) |
| `CardDescription` | `card-description` | `text-muted-foreground text-sm` | Descriptive text below title |
| `CardContent` | (none) | Flexible content area | Chart or form content |

### Usage Template

```tsx
<Card className="border-border/60">
  <CardHeader className="pb-4">
    <CardTitle className="text-base font-semibold">Section Title</CardTitle>
    <CardDescription>Descriptive subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Card Border Conventions

| State | Classes |
|-------|---------|
| Default | `border-border/60` |
| Hover (KPI cards) | `hover:border-border transition-colors` |

## 6. Skeleton Loading Pattern

The `Skeleton` component in `src/components/ui/skeleton.tsx`:

```tsx
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}
```

### Consistent Skeleton Sizing

| Content Type | Classes | Context |
|-------------|---------|---------|
| Label / title | `h-4 w-28` | KPI card label |
| Icon placeholder | `h-8 w-8 rounded-lg` | KPI card icon |
| Value (large number) | `h-8 w-36` | KPI card metric value |
| Helper text | `h-3 w-44` | KPI card helper description |
| Chart title | `h-5 w-52` | Chart card header |
| Chart subtitle | `h-3 w-64` | Chart card description |
| Chart area | `h-[280px] w-full rounded-lg` | Chart rendering area |

### Early-Return Loading Pattern

Every dashboard component checks `loading` first and returns early:

```tsx
export function KPICard({ label, value, icon, variant, loading }: KPICardProps) {
  if (loading) {
    return (
      <Card className="border-border/60">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-3 w-44" />
        </CardContent>
      </Card>
    )
  }

  // Real rendering follows...
}
```

## 7. Icon Conventions (Lucide React)

### Import Pattern

Import icons directly from their individual file to avoid loading the barrel (~1583 modules):

```tsx
// ✅ Correct — direct import
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard'

// ❌ Wrong — barrel import (avoids ~2.8s dev startup penalty)
import { LayoutDashboard } from 'lucide-react'
```

### Type Declarations

The `env.d.ts` file declares modules for direct imports:

```ts
// src/env.d.ts
declare module 'lucide-react/dist/esm/icons/layout-dashboard' {
  import { type LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
```

### Placement in Components

Icons are rendered inside a `span` wrapper:

```tsx
<span
  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
  role="img"
  aria-label="Dashboard"
>
  <LayoutDashboard size={18} aria-hidden="true" />
</span>
```

- The wrapper gets `role="img"` + `aria-label` for accessible naming
- The `<Icon>` element itself gets `aria-hidden="true"` to avoid double-announcement
- In KPI cards, the icon wrapper gets `aria-hidden="true"` (icon is decorative there)

### Type Import for Interfaces

When only the type is needed (not a specific icon), use the type import:

```tsx
import { type LucideIcon } from 'lucide-react'
// Used for: icon: LucideIcon in prop interfaces
```

## 8. Dashboard Header Pattern

Located in `src/components/dashboard/dashboard-header.tsx`:

```tsx
export function DashboardHeader({ period = '2024 — Full Year' }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Icon badge */}
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
          role="img" aria-label="Dashboard">
          <LayoutDashboard size={18} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Financial Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Executive metrics dashboard</p>
        </div>
      </div>
      {/* Period badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {period}
        </span>
      </div>
    </header>
  )
}
```

### Badge Style Reference

| Badge | Classes | Role |
|-------|---------|------|
| Period pill (header) | `rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground` | Current reporting period |
| KPI icon badge | `p-1.5 rounded-lg bg-[var(--{type}-badge)] text-[var(--{type}-badge-fg)]` | KPI category indicator |

## 9. KPI Card Variant System

4 KPI variants with a style map lookup:

```tsx
const variantStyles: Record<KPICardProps['variant'], { badge: string; icon: string }> = {
  income: {
    badge: 'bg-[var(--income-badge)] text-[var(--income-badge-fg)]',
    icon: 'text-[var(--income-badge-fg)]',
  },
  outcome: {
    badge: 'bg-[var(--outcome-badge)] text-[var(--outcome-badge-fg)]',
    icon: 'text-[var(--outcome-badge-fg)]',
  },
  profit: {
    badge: 'bg-[var(--profit-badge)] text-[var(--profit-badge-fg)]',
    icon: 'text-[var(--profit-badge-fg)]',
  },
  profitPercent: {
    badge: 'bg-[var(--profit-badge)] text-[var(--profit-badge-fg)]',
    icon: 'text-[var(--profit-badge-fg)]',
  },
}
```

| Variant | Badge Color Token | Icon Color Token |
|---------|-------------------|------------------|
| `income` | `--income-badge` (green) | `--income-badge-fg` |
| `outcome` | `--outcome-badge` (red/orange) | `--outcome-badge-fg` |
| `profit` | `--profit-badge` (blue) | `--profit-badge-fg` |
| `profitPercent` | `--profit-badge` (blue) | `--profit-badge-fg` |

### KPI Card Template

```tsx
<Card className="border-border/60 hover:border-border transition-colors">
  <CardContent className="p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase text-pretty">
        {label}
      </span>
      <span className={cn('p-1.5 rounded-lg', styles.badge)} aria-hidden="true">
        <Icon size={16} className={styles.icon} />
      </span>
    </div>
    <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground leading-relaxed">{helperText}</p>
  </CardContent>
</Card>
```

## 10. Recharts Chart Conventions

### Shared Pattern (`IncomeOutcomeChart` / `ProfitPercentChart`)

```tsx
export function SomeChart({ data, loading }: SomeChartProps) {
  // 1. Loading state (early return)
  if (loading) { /* Card with Skeletons */ }

  // 2. Empty data state
  const hasData = data.some(/* ... */)
  if (!hasData) { /* Centered "No data available" message */ }

  // 3. Chart rendering
  return (
    <Card className="border-border/60" role="region" aria-label="...">
      <CardHeader>...</CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
            {/* Series */}
            <CustomTooltip />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

### Chart-Specific Differences

| Feature | IncomeOutcomeChart | ProfitPercentChart |
|---------|--------------------|--------------------|
| Series | 2 Lines (income, outcome) | 1 Line (profitPercent) |
| Y-Axes | Dual (left + right) | Single |
| Stroke colors | `--color-chart-1`, `--color-chart-2` | `var(--chart-profit)` |
| Reference line | None | `ReferenceLine(y=0, ...)` |
| Tooltip value format | `formatCurrency(entry.value)` | `value.toFixed(1) + "%"` |

### Custom Tooltip Pattern

Both charts define a `CustomTooltip` function with identical structure:

```tsx
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}
```

### Empty Data State

```tsx
<div
  className="flex h-[280px] items-center justify-center text-muted-foreground text-sm"
  role="status"
>
  No data available to display
</div>
```

### Loading State (Chart)

```tsx
<Card className="border-border/60">
  <CardHeader className="pb-4">
    <Skeleton className="h-5 w-52" />
    <Skeleton className="h-3 w-64 mt-1" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-[280px] w-full rounded-lg" />
  </CardContent>
</Card>
```

## 11. Error Display Pattern

```tsx
<div
  role="alert"
  aria-live="assertive"
  className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
>
  {errorMessage}
</div>
```

- `role="alert"` + `aria-live="assertive"` ensures screen reader interruption
- Uses destructive color tokens with opacity modifiers `border-destructive/30 bg-destructive/10`

## 12. Main App Layout (`App.tsx`)

### State Management Pattern

```tsx
function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
}
```

| State | Initial Value | Set By |
|-------|--------------|--------|
| `metrics` | `null` (not yet loaded) | API fetch → `computeKPIs()` |
| `monthlyData` | `[]` (empty) | API fetch → `computeMonthlyData()` |
| `loading` | `true` | `fetch().finally(() => setLoading(false))` |
| `error` | `null` (no error) | `fetch().catch()` |

### Data Fetching Convention

- Single async data fetch in `useEffect`
- `.then()` chain for data processing, `.catch()` for error state, `.finally()` for loading state
- Fetch function is a standalone async function (not inline in the effect)
- Error message is user-facing (not the raw exception)

### Section Structure

```tsx
<main id="main-content" className="dark min-h-screen bg-background text-foreground">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <DashboardHeader period="2024 - Full Year" />
    {error ? <ErrorBanner /> : null}
    <section aria-label="Key performance indicators" aria-busy={loading}>
      <KPIRow metrics={metrics} loading={loading} />
    </section>
    <section aria-label="Financial charts" aria-busy={loading}
      className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <IncomeOutcomeChart data={monthlyData} loading={loading} />
      <ProfitPercentChart data={monthlyData} loading={loading} />
    </section>
  </div>
</main>
```

- `className="dark"` on `<main>` enables dark mode via `@custom-variant dark`
- `aria-busy={loading}` on sections indicates loading state to screen readers
- Sections always rendered (content toggles internally via loading/error checks)
- Error banner disappears when no error (conditional rendering with `? ... : null`)

## 13. TypeScript Type Conventions

### Type Deduplication

Types shared across backend and frontend are defined in two places:
- **Backend**: Pydantic models in `routes.py`
- **Frontend**: TypeScript interfaces in `src/lib/financial-types.ts`

```ts
export type OperationType = 'income' | 'outcome'
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
export type BusinessType = 'B2B' | 'B2C'

export interface FinancialMovement {
  create_date: string  // ISO date
  amount: number
  operation_type: OperationType
  category: Category
  business_type: BusinessType
}

export interface KPIMetrics {
  totalIncome: number
  totalOutcome: number
  profit: number
  profitPercent: number
}

export interface MonthlyDataPoint {
  month: string
  income: number
  outcome: number
  profitPercent: number
}
```

### Spec Types

Future feature types live in `frontend/specs/`:
- `api-types.ts` — API response types (FacetsResponse, AlertEntry, CategoryEntry)
- `param-types.ts` — Query parameter types (DateRangeFilter, AlertsParams, TopCategoriesParams)

These are TypeScript source files, re-exporting shared frontend literal types.

## 14. Component States Checklist

Every dashboard component should support these states:

| State | Visibility | Mechanism |
|-------|-----------|-----------|
| **Loading** | Skeleton placeholders | `loading` prop → early return |
| **Data available** | Full rendered content | Default branch |
| **Empty data** | "No data available" message | `data.some()` check → empty state |
| **Error** | Error banner above content | `App.tsx` level, not per-component |
| **Accessible** | Labels, roles, aria-busy, aria-hidden | Props on elements |

## 15. Accessibility Conventions (Specific to UI)

| Pattern | Application |
|---------|------------|
| `<main id="main-content">` | Landmark for skip link |
| `<section aria-label="...">` | Section landmark with descriptive name |
| `aria-busy={loading}` | Indicates dynamic content loading |
| `role="alert"` + `aria-live="assertive"` | Error banner (WCAG 4.1.3) |
| `role="img"` + `aria-label` on icon wrappers | Icon accessible name |
| `aria-hidden="true"` on `<Icon>` elements | Avoid double-announcement |
| `<h1>`, `<h2>` heading hierarchy | CardTitle renders as `<h2>` |
| `role="region"` + `aria-label` on chart cards | Chart landmark for navigation |

## 16. File Naming and Location

| Pattern | Convention |
|---------|-----------|
| Component files | `src/components/{section}/{name}.tsx` (kebab-case) |
| UI primitives | `src/components/ui/{name}.tsx` |
| Utility functions | `src/lib/{name}.ts` |
| Type definitions | `src/lib/{name}-types.ts` |
| Test files | Co-located: `src/lib/{name}.test.ts` |
| Future spec types | `frontend/specs/{name}.ts` (TypeScript source) |
| Future spec docs | `frontend/specs/{name}.md`