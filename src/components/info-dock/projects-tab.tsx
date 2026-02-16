import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { EditableTable, type ColumnDef } from './editable-table'
import type { Project } from '@/types/info-dock'

const sampleProjects: Project[] = [
  { id: '1', name: 'UniFire', uiCode: 'UF', description: 'GDS Terminal & Booking Tool' },
  { id: '2', name: 'Price Tracker', uiCode: 'PT', description: 'PNR price monitoring' },
  { id: '3', name: 'VipFinder', uiCode: 'VF', description: 'VIP availability search' },
  { id: '4', name: 'BitFinder', uiCode: 'BF', description: 'Best itinerary finder' },
]

const projectColumns: ColumnDef<Project>[] = [
  { key: 'name', header: 'Name', placeholder: 'Project name' },
  { key: 'uiCode', header: 'UI Code', placeholder: 'XX', maxLength: 4, width: '100px' },
  { key: 'description', header: 'Description', placeholder: 'Description' },
]

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projects</CardTitle>
          <CardDescription>Manage platform projects and their identifiers</CardDescription>
        </CardHeader>
        <CardContent>
          <EditableTable
            title=""
            columns={projectColumns}
            data={projects}
            onAdd={(item) => {
              const newProject: Project = { id: String(Date.now()), ...item } as Project
              setProjects([...projects, newProject])
            }}
            onUpdate={(item) => setProjects(projects.map((p) => (p.id === item.id ? item : p)))}
            onDelete={(id) => setProjects(projects.filter((p) => p.id !== id))}
            emptyDefaults={{ name: '', uiCode: '', description: '' }}
            addLabel="Add Project"
          />
        </CardContent>
      </Card>
    </div>
  )
}
