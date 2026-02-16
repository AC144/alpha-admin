import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PricingAllTab } from './pricing-all-tab'
import { IssuingFeesTab } from './issuing-fees-tab'
import { SearchSetupTab } from './search-setup-tab'
import { PccPriorityTab } from './pcc-priority-tab'
import { AccessControlTab } from './access-control-tab'
import { PnrToolTab } from './pnr-tool-tab'
import { UsersTab } from '@/components/tools/unifire/users-tab'

const tabs = [
  { id: 'pricing-all', label: 'Pricing All', component: PricingAllTab },
  { id: 'issuing-fees', label: 'Issuing Fees', component: IssuingFeesTab },
  { id: 'search-setup', label: 'Search Setup', component: SearchSetupTab },
  { id: 'pcc-priority', label: 'PCC Priority', component: PccPriorityTab },
  { id: 'access-control', label: 'Access Control', component: AccessControlTab },
  { id: 'pnr-tool', label: 'PNR Tool', component: PnrToolTab },
  { id: 'users', label: 'Users', component: UsersTab },
]

export function UniFireConfigPage() {
  const { companyId } = useParams<{ companyId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const activeTab = searchParams.get('tab') || 'pricing-all'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/companies/${companyId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="UniFire Configuration"
          description="Configure UniFire settings for this company."
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <tab.component companyId={companyId || ''} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
