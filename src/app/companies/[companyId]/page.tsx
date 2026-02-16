
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useQuery } from '@apollo/client'
import { GET_COMPANY } from '@/lib/api/graphql/queries'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompanyOverview } from '@/components/companies/company-overview'
import { CompanyUsers } from '@/components/companies/company-users'
import { CompanyTools } from '@/components/companies/company-tools'
import { CompanySettings } from '@/components/companies/company-settings'
import type { Company } from '@/types'

// Mock data - used as fallback when backend is unavailable
const mockCompany: Company = {
  id: 'comp-001',
  name: 'Travel Pelicans',
  email: 'contact@travelpelicans.com',
  status: 'active',
  subscription: 'enterprise',
  usersCount: 2,
  enabledTools: ['Price Tracker', 'UniFire'],
  createdAt: '2024-01-15',
  updatedAt: '2024-05-20',
  contacts: [
    {
      id: '1',
      person: 'Alice Johnson',
      position: 'Manager',
      phone: '+1 555-0123',
      email: 'alice@travelpelicans.com',
      isPrimary: true,
    },
  ],
  pccs: [
    {
      id: '1',
      gds: 'sabre',
      homePcc: 'U9XF',
      worksPccs: ['VV6K', 'SP9L'],
    },
  ],
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-36" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function CompanyDetailPage() {
  const { companyId } = useParams()

  const { data, loading, error } = useQuery(GET_COMPANY, {
    variables: { id: companyId },
    skip: !companyId,
  })

  const company: Company = data?.company || mockCompany

  if (loading && !data) {
    return <DetailSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </Link>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Unable to connect to the API. Showing sample data.</p>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title={company.name}
        description={`Manage ${company.name}'s details, users, and tools.`}
      >
        <Button variant="outline">Edit Company</Button>
      </PageHeader>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CompanyOverview company={company} />
        </TabsContent>

        <TabsContent value="users">
          <CompanyUsers companyId={company.id} />
        </TabsContent>

        <TabsContent value="tools">
          <CompanyTools companyId={company.id} />
        </TabsContent>

        <TabsContent value="settings">
          <CompanySettings companyId={company.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
