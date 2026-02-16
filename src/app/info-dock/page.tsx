import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GdsDataTab } from '@/components/info-dock/gds-data-tab'
import { FareCabinTab } from '@/components/info-dock/fare-cabin-tab'
import { ProjectsTab } from '@/components/info-dock/projects-tab'
import { AirlinesTab } from '@/components/info-dock/airlines-tab'
import { AirportsTab } from '@/components/info-dock/airports-tab'
import { BackupTab } from '@/components/info-dock/backup-tab'

const tabs = [
  { id: 'gds-data', label: 'GDS Data', component: GdsDataTab },
  { id: 'fare-cabin', label: 'Fare & Cabin', component: FareCabinTab },
  { id: 'projects', label: 'Projects', component: ProjectsTab },
  { id: 'airlines', label: 'Airlines', component: AirlinesTab },
  { id: 'airports', label: 'Airports', component: AirportsTab },
  { id: 'backup', label: 'Backup', component: BackupTab },
]

export function InfoDockPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'gds-data'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Info Dock"
        description="Central hub for all global reference data used across the platform."
      />

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
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
