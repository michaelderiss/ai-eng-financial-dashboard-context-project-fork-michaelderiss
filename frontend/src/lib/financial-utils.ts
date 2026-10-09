import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "./financial-types";

// Hoist Intl.NumberFormat outside function to avoid recreation on every call (js-cache-function-results)
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function toYearMonthKey(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthYearLabel(yearMonthKey: string): string {
  const [yearText, monthText] = yearMonthKey.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function computeKPIs(movements: FinancialMovement[]): KPIMetrics {
  // Early exit: avoid unnecessary iteration when there's no data
  if (movements.length === 0) {
    return { totalIncome: 0, totalOutcome: 0, profit: 0, profitPercent: 0 };
  }

  // Combine two filter+reduce chains into a single O(n) pass (js-combine-iterations)
  let totalIncome = 0;
  let totalOutcome = 0;

  for (let i = 0; i < movements.length; i++) {
    const m = movements[i];
    // Cache property accesses to avoid repeated lookups (js-cache-property-access)
    const opType = m.operation_type;
    const amount = m.amount;

    if (opType === "income") {
      totalIncome += amount;
    } else {
      totalOutcome += amount;
    }
  }

  const profit = totalIncome - totalOutcome;
  const profitPercent = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  return { totalIncome, totalOutcome, profit, profitPercent };
}

export function computeMonthlyData(
  movements: FinancialMovement[],
): MonthlyDataPoint[] {
  // Use Map for O(1) lookups instead of Record (js-set-map-lookups)
  const monthlyMap = new Map<string, { income: number; outcome: number }>();

  for (let i = 0; i < movements.length; i++) {
    const m = movements[i];
    // Cache property accesses (js-cache-property-access)
    const dateStr = m.create_date;
    const opType = m.operation_type;
    const amount = m.amount;

    const yearMonthKey = toYearMonthKey(new Date(dateStr));
    const entry = monthlyMap.get(yearMonthKey);
    if (entry) {
      if (opType === "income") {
        entry.income += amount;
      } else {
        entry.outcome += amount;
      }
    } else {
      monthlyMap.set(yearMonthKey, {
        income: opType === "income" ? amount : 0,
        outcome: opType === "outcome" ? amount : 0,
      });
    }
  }

  // Use toSorted() for immutability instead of .sort() which mutates (js-tosorted-immutable)
  const sortedKeys = Array.from(monthlyMap.keys()).toSorted();

  const result: MonthlyDataPoint[] = [];
  for (let i = 0; i < sortedKeys.length; i++) {
    const yearMonthKey = sortedKeys[i];
    const { income, outcome } = monthlyMap.get(yearMonthKey)!;
    const profit = income - outcome;
    const profitPercent = income > 0 ? (profit / income) * 100 : 0;
    result.push({
      month: formatMonthYearLabel(yearMonthKey),
      income,
      outcome,
      profitPercent,
    });
  }

  return result;
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
