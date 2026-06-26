import type { BusinessType } from './api-types'

/**
 * Shared optional date filters accepted by metrics endpoints.
 */
export interface DateRangeFilter {
  /**
   * Inclusive lower bound for create_date filtering.
   * Format: YYYY-MM-DD.
   * When omitted, the API does not apply a minimum date.
   */
  start_date?: string

  /**
   * Inclusive upper bound for create_date filtering.
   * Format: YYYY-MM-DD.
   * When omitted, the API does not apply a maximum date.
   */
  end_date?: string
}

/**
 * Query parameters sent to GET /api/metrics/alerts for the anomaly table feature.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Spike threshold ratio used to flag anomalous outcome growth.
   * UI constraint: 0.01 to 1.0 inclusive.
   * API default: 0.3.
   */
  threshold: number
}

/**
 * Query parameters sent to GET /api/metrics/categories/top for each comparison panel.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Business line to request for the panel.
   * Valid values are 'B2B' and 'B2C'.
   */
  business_type: BusinessType

  /**
   * Operation type to aggregate.
   * This feature must send the literal value 'income'.
   */
  operation_type: 'income'

  /**
   * Maximum number of ranked categories to return.
   * This feature must send the literal value 5.
   */
  limit: 5
}