// Session limits defaults
export const DEFAULT_MAX_SESSIONS_PER_USER = 3
export const DEFAULT_MAX_SESSIONS_PER_COMPANY = 50

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

// Company status display config
export const COMPANY_STATUS_CONFIG = {
  active: { label: 'Active', variant: 'success' as const },
  inactive: { label: 'Inactive', variant: 'destructive' as const },
  trial: { label: 'Trial', variant: 'warning' as const },
} as const

// Alert severity colors
export const ALERT_SEVERITY_COLORS: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
}

// Alert severity badge variants
export const ALERT_SEVERITY_VARIANTS: Record<string, 'destructive' | 'warning' | 'success'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'success',
}
