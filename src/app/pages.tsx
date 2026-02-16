
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AccessControlTab } from '@/app/companies/[companyId]/tools/unifire/access-control-tab'

// UniFire Project Page
export function UniFireProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="UniFire"
        description="Default configuration for UniFire terminal. This configuration is cloned when a new company is created."
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>UniFire Terminal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure default settings for UniFire terminal access. These settings serve as templates that are cloned to each company upon creation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="access-control" className="mt-6">
          <AccessControlTab companyId="default" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Price Tracker Project Page
export function PriceTrackerProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Price Tracker"
        description="Default configuration for Price Tracker service. This configuration is cloned when a new company is created."
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Tracker Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure default settings for PNR price monitoring. These settings serve as templates that are cloned to each company upon creation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="access-control" className="mt-6">
          <AccessControlTab companyId="default" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// BitFinder Project Page
export function BitFinderProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="BitFinder"
        description="Default configuration for BitFinder service. This configuration is cloned when a new company is created."
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>BitFinder Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure default settings for BitFinder service. These settings serve as templates that are cloned to each company upon creation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="access-control" className="mt-6">
          <AccessControlTab companyId="default" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Analytics Page
export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Post-processing data and price history charts."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Post-Processing Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics for processed transactions and operations.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Price History Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Historical price trends and savings analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Audit Page
export function AuditPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit"
        description="System audit logs and activity tracking."
      />
      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Audit logs grouped by service.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                UniFire cmdIn/Out and BitFinder API calls.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Audit logs grouped by user activity.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Users Page
export function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage Alpha Admin users."
      >
        <Button>Invite User</Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            List of users with access to Alpha Admin.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Page
export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Alpha Admin general settings."
      />
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Application Name</label>
            <Input defaultValue="Alpha Admin" />
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Status Page
export function StatusPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Status"
        description="Service health checks and system status."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {['UniFire API', 'Price Tracker', 'Sabre GDS', 'Database', 'Auth Service'].map((service) => (
          <Card key={service}>
            <CardContent className="flex items-center justify-between pt-6">
              <span className="font-medium">{service}</span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Healthy</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
