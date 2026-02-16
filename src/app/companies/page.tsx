import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MoreHorizontal, AlertCircle } from 'lucide-react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_COMPANIES, CREATE_COMPANY } from '@/lib/api/graphql/queries'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { AddCompanyModal } from '@/components/companies/add-company-modal'
import { COMPANY_STATUS_CONFIG, DEFAULT_PAGE_SIZE } from '@/lib/constants'
import type { Company } from '@/types'
import type { CreateCompanyInput } from '@/lib/validations/company'

// Mock data - used as fallback when backend is unavailable
const mockCompanies: Company[] = [
  {
    id: 'comp-001',
    name: 'Travel Pelicans',
    email: 'contact@travelpelicans.com',
    status: 'active',
    subscription: 'enterprise',
    usersCount: 2,
    enabledTools: ['Price Tracker', 'UniFire'],
    createdAt: '2024-01-15',
    updatedAt: '2024-05-20',
    contacts: [],
    pccs: [],
  },
  {
    id: 'comp-002',
    name: 'VIP Trips',
    email: 'info@viptrips.com',
    status: 'active',
    subscription: 'pro',
    usersCount: 2,
    enabledTools: ['Price Tracker'],
    createdAt: '2024-02-10',
    updatedAt: '2024-05-18',
    contacts: [],
    pccs: [],
  },
  {
    id: 'comp-003',
    name: 'FlyHigh Agency',
    email: 'support@flyhigh.com',
    status: 'trial',
    subscription: 'pro',
    usersCount: 1,
    enabledTools: ['UniFire'],
    createdAt: '2024-05-01',
    updatedAt: '2024-05-15',
    contacts: [],
    pccs: [],
  },
  {
    id: 'comp-004',
    name: 'Global Tours',
    email: 'admin@globaltours.net',
    status: 'inactive',
    subscription: 'basic',
    usersCount: 1,
    enabledTools: [],
    createdAt: '2023-11-20',
    updatedAt: '2024-03-10',
    contacts: [],
    pccs: [],
  },
  {
    id: 'comp-005',
    name: 'Sky Ventures',
    email: 'ventures@sky.com',
    status: 'active',
    subscription: 'enterprise',
    usersCount: 0,
    enabledTools: ['Price Tracker', 'UniFire'],
    createdAt: '2024-04-05',
    updatedAt: '2024-05-21',
    contacts: [],
    pccs: [],
  },
]

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  )
}

export function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [localCompanies, setLocalCompanies] = useState<Company[]>(mockCompanies)
  const [currentPage, setCurrentPage] = useState(1)

  const { data, loading, error } = useQuery(GET_COMPANIES, {
    variables: { search: searchQuery || undefined },
  })

  const [createCompany] = useMutation(CREATE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
  })

  const companies: Company[] = data?.companies || localCompanies

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalItems = filteredCompanies.length
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE
  )

  const handleAddCompany = async (formData: CreateCompanyInput) => {
    try {
      await createCompany({ variables: { input: formData } })
    } catch {
      // Backend unavailable - fall back to local state
      const primaryContact = formData.contacts.find((c) => c.isPrimary) || formData.contacts[0]
      const status: Company['status'] = formData.subscription === 'trial' ? 'trial' : 'active'

      const newCompany: Company = {
        id: `comp-${String(localCompanies.length + 1).padStart(3, '0')}`,
        name: formData.name,
        email: primaryContact?.email || '',
        status,
        subscription: formData.subscription === 'trial' ? 'basic' : formData.subscription,
        usersCount: 0,
        enabledTools: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        contacts: formData.contacts.map((c) => ({
          id: c.id,
          person: c.person,
          position: c.position,
          phone: c.phone,
          email: c.email,
          whatsapp: c.whatsapp,
          telegram: c.telegram,
          isPrimary: c.isPrimary,
        })),
        pccs: formData.gdsConfigs.map((gds) => ({
          id: gds.id,
          gds: gds.provider === 'sabre' ? 'sabre' : gds.provider === 'amadeus' ? 'amadeus' : 'travelport',
          homePcc: gds.homePcc,
          worksPccs: gds.worksPccs,
        })),
      }
      setLocalCompanies([newCompany, ...localCompanies])
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage your client companies."
      >
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </PageHeader>

      <AddCompanyModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddCompany}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Unable to connect to the API. Showing sample data.</p>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="pl-9"
        />
      </div>

      {/* Company List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Company List</CardTitle>
          <p className="text-sm text-muted-foreground">
            A list of all companies in the system.
          </p>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <TableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Subscription</th>
                      <th className="pb-3">Users</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCompanies.map((company) => (
                      <tr key={company.id}>
                        <td>
                          <Link
                            to={`/companies/${company.id}`}
                            className="group"
                          >
                            <p className="font-medium group-hover:text-primary">
                              {company.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {company.email}
                            </p>
                          </Link>
                        </td>
                        <td>
                          <Badge variant={COMPANY_STATUS_CONFIG[company.status].variant}>
                            {COMPANY_STATUS_CONFIG[company.status].label}
                          </Badge>
                        </td>
                        <td className="capitalize">{company.subscription}</td>
                        <td>{company.usersCount}</td>
                        <td className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/companies/${company.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={DEFAULT_PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
