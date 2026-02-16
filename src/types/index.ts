// Company types
export interface Company {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'trial'
  subscription: 'basic' | 'pro' | 'enterprise'
  usersCount: number
  enabledTools: string[]
  createdAt: string
  updatedAt: string
  contacts: Contact[]
  pccs: PCC[]
}

export interface Contact {
  id: string
  person: string
  position?: string
  phone?: string
  email: string
  whatsapp?: string
  telegram?: string
  isPrimary: boolean
}

export interface PCC {
  id: string
  gds: 'sabre' | 'amadeus' | 'travelport'
  homePcc: string
  worksPccs: string[]
}

// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'super_admin' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  companyId?: string
  createdAt: string
  lastLoginAt?: string
}

// Project/Tool types
export type ProjectType = 'unifire' | 'price-tracker' | 'vip-finder'

export interface Project {
  id: ProjectType
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface ProjectConfig {
  projectId: ProjectType
  companyId: string
  enabled: boolean
  settings: Record<string, unknown>
}

// UniFire specific
export interface UniFireConfig {
  maxUsers: number
  maxConcurrentSessions: number
  roles: Role[]
  userPermissions: UserPermission[]
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface UserPermission {
  userId: string
  roleId: string
  customPermissions?: string[]
}

// Price Tracker specific
export interface PriceTrackerConfig {
  enabled: boolean
  rules: PriceRule[]
  trackedPnrs: TrackedPNR[]
}

export interface TrackedPNR {
  id: string
  pnr: string
  priceDrop: number
  createdAt: string
  lastChecked?: string
}

export interface PriceRule {
  id: string
  name: string
  active: boolean
  includeCriteria: RuleCriteria
  excludeCriteria: RuleCriteria
  repriceConfig: RepriceConfig
  customActions?: string[]
}

export interface RuleCriteria {
  company?: string[]
  airline?: string[]
  pccCreation?: string[]
  cabinClass?: string[]
  fareType?: string[]
  departureDates?: { start?: string; end?: string }
  returnDates?: { start?: string; end?: string }
  departureGeo?: string[]
  destinationGeo?: string[]
  threshold?: number
  postVoidThreshold?: number
}

export interface RepriceConfig {
  pcc: string
  originalPricing: string
  originalPcc: string
  default: string
}

// Audit types
export interface AuditLog {
  id: string
  timestamp: string
  action: string
  userId?: string
  userName?: string
  companyId?: string
  companyName?: string
  projectId?: ProjectType
  details: Record<string, unknown>
  ipAddress?: string
}

// Dashboard types
export interface DashboardStats {
  totalCompanies: number
  companiesThisMonth: number
  totalUsers: number
  usersThisMonth: number
  activeSubscriptions: number
  securityAlerts: number
  activeSessions: number
  trackedPnrs: number
  priceDropsToday: number
}

export interface Activity {
  id: string
  timestamp: string
  action: string
  description: string
  user?: {
    name: string
    avatar?: string
  }
  company?: {
    name: string
  }
}

// Widget types for customizable dashboard
export interface DashboardWidget {
  id: string
  type: 'stats' | 'chart' | 'activity' | 'alerts' | 'quick-actions'
  title: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  projectFilter?: ProjectType
  config?: Record<string, unknown>
}

// Service health
export interface ServiceHealth {
  id: string
  name: string
  status: 'healthy' | 'degraded' | 'down'
  latency?: number
  lastCheck: string
  uptime: number
}
