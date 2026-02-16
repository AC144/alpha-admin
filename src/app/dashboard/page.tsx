
import {
  Building2,
  Users,
  CreditCard,
  AlertTriangle,
  TrendingDown,
  Activity,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_DASHBOARD_STATS, GET_RECENT_ACTIVITY } from '@/lib/api/graphql/queries'
import { PageHeader } from '@/components/layout/page-header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ALERT_SEVERITY_COLORS, ALERT_SEVERITY_VARIANTS } from '@/lib/constants'
import type { Activity as ActivityType } from '@/types'

// Mock data - used as fallback when backend is unavailable
const mockStats = {
  totalCompanies: 5,
  companiesThisMonth: 2,
  totalUsers: 6,
  usersThisMonth: 10,
  activeSubscriptions: 4,
  securityAlerts: 2,
  priceDropsToday: 23,
  trackedPnrs: 847,
  activeSessions: 12,
}

const mockActivities: ActivityType[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action: 'rule_created',
    description: 'created PNR tracking rule "Europe Q1"',
    user: { name: 'Alice Johnson' },
    company: { name: 'Travel Pelicans' },
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    action: 'company_created',
    description: 'registered new company "Pacific Travel"',
    user: { name: 'System' },
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    action: 'price_drop',
    description: 'Price drop detected: AB3DE1 ($1,250 → $1,000)',
    company: { name: 'VIP Trips' },
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    action: 'session_start',
    description: 'signed in to UniFire terminal',
    user: { name: 'Bob Williams' },
    company: { name: 'Travel Pelicans' },
  },
]

const mockAlerts = [
  { id: '1', pnr: 'AB3DE1', drop: 250, company: 'Travel Pelicans', severity: 'high' },
  { id: '2', pnr: 'FG6HI2', drop: 50, company: 'VIP Trips', severity: 'medium' },
  { id: '3', pnr: 'XY9ZK3', drop: 15, company: 'Sky Ventures', severity: 'low' },
]

function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-32" />
        </Card>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_DASHBOARD_STATS)
  const { data: activityData, loading: activityLoading, error: activityError } = useQuery(GET_RECENT_ACTIVITY, {
    variables: { limit: 10 },
  })

  const stats = statsData?.dashboardStats || mockStats
  const activities = activityData?.recentActivity || mockActivities
  const hasError = statsError || activityError

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="A high-level overview of your application."
      />

      {hasError && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Unable to connect to the API. Showing sample data.</p>
        </div>
      )}

      {/* Stats Grid */}
      {statsLoading && !statsData ? (
        <StatsGridSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Companies"
              value={stats.totalCompanies}
              change={`+${stats.companiesThisMonth} this month`}
              changeType="positive"
              icon={Building2}
            />
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              change={`+${stats.usersThisMonth} this month`}
              changeType="positive"
              icon={Users}
            />
            <StatsCard
              title="Active Subscriptions"
              value={stats.activeSubscriptions}
              change="Across all companies"
              changeType="neutral"
              icon={CreditCard}
            />
            <StatsCard
              title="Security Alerts"
              value={stats.securityAlerts}
              change="Flagged in the last 24h"
              changeType={stats.securityAlerts > 0 ? 'negative' : 'positive'}
              icon={AlertTriangle}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Price Drops Today"
              value={stats.priceDropsToday}
              icon={TrendingDown}
            />
            <StatsCard
              title="Tracked PNRs"
              value={stats.trackedPnrs}
              icon={Activity}
            />
            <StatsCard
              title="Active Sessions"
              value={stats.activeSessions}
              icon={Users}
            />
          </div>
        </>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Price Drop Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Price Drop Alerts (Last 24h)
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/analytics" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${ALERT_SEVERITY_COLORS[alert.severity] || 'bg-gray-500'}`}
                    />
                    <div>
                      <p className="font-mono text-sm font-medium">{alert.pnr}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.company}
                      </p>
                    </div>
                  </div>
                  <Badge variant={ALERT_SEVERITY_VARIANTS[alert.severity] || 'default'}>
                    -${alert.drop}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading && !activityData ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityFeed activities={activities} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
