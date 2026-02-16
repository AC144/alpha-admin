import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  companies: 'Companies',
  projects: 'Client Projects',
  unifire: 'UniFire',
  'price-tracker': 'Price Tracker',
  'bit-finder': 'BitFinder',
  roles: 'Roles',
  permissions: 'Permissions',
  analytics: 'Analytics',
  audit: 'Audit',
  services: 'Services',
  users: 'Users',
  settings: 'Settings',
  status: 'Status',
  overview: 'Overview',
  tools: 'Tools',
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) {
    return null
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = routeLabels[segment] || segment.replace(/-/g, ' ')
    const isLast = index === pathSegments.length - 1

    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      path,
      isLast,
    }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className={cn(
                'text-muted-foreground transition-colors hover:text-foreground',
                'max-w-[150px] truncate'
              )}
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
