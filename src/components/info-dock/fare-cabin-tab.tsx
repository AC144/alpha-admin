import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { EditableTable, type ColumnDef } from './editable-table'
import type { FareType, Cabin } from '@/types/info-dock'

const sampleFareTypes: FareType[] = [
  { id: '1', name: 'Published', code: 'PUB', description: 'Standard published fare' },
  { id: '2', name: 'Private', code: 'PRI', description: 'Negotiated private fare' },
  { id: '3', name: 'Web', code: 'WEB', description: 'Online booking fare' },
  { id: '4', name: 'Tour', code: 'TOUR', description: 'Tour operator fare' },
  { id: '5', name: 'Corporate', code: 'CORP', description: 'Corporate negotiated fare' },
]

const sampleCabins: Cabin[] = [
  { id: '1', name: 'Economy', code: 'Y', description: 'Economy class' },
  { id: '2', name: 'Premium Economy', code: 'W', description: 'Premium economy class' },
  { id: '3', name: 'Business', code: 'C', description: 'Business class' },
  { id: '4', name: 'First', code: 'F', description: 'First class' },
]

const fareTypeColumns: ColumnDef<FareType>[] = [
  { key: 'name', header: 'Name', placeholder: 'Fare type name' },
  { key: 'code', header: 'Code', placeholder: 'XXX', maxLength: 5, width: '100px' },
  { key: 'description', header: 'Description', placeholder: 'Description' },
]

const cabinColumns: ColumnDef<Cabin>[] = [
  { key: 'name', header: 'Name', placeholder: 'Cabin name' },
  { key: 'code', header: 'Code', placeholder: 'X', maxLength: 1, width: '80px' },
  { key: 'description', header: 'Description', placeholder: 'Description' },
]

export function FareCabinTab() {
  const [fareTypes, setFareTypes] = useState<FareType[]>(sampleFareTypes)
  const [cabins, setCabins] = useState<Cabin[]>(sampleCabins)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fare Types</CardTitle>
          <CardDescription>Manage fare type classifications</CardDescription>
        </CardHeader>
        <CardContent>
          <EditableTable
            title=""
            columns={fareTypeColumns}
            data={fareTypes}
            onAdd={(item) => {
              const newFare: FareType = { id: String(Date.now()), ...item } as FareType
              setFareTypes([...fareTypes, newFare])
            }}
            onUpdate={(item) => setFareTypes(fareTypes.map((f) => (f.id === item.id ? item : f)))}
            onDelete={(id) => setFareTypes(fareTypes.filter((f) => f.id !== id))}
            emptyDefaults={{ name: '', code: '', description: '' }}
            addLabel="Add Fare Type"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cabin Classes</CardTitle>
          <CardDescription>Manage cabin class definitions</CardDescription>
        </CardHeader>
        <CardContent>
          <EditableTable
            title=""
            columns={cabinColumns}
            data={cabins}
            onAdd={(item) => {
              const newCabin: Cabin = { id: String(Date.now()), ...item } as Cabin
              setCabins([...cabins, newCabin])
            }}
            onUpdate={(item) => setCabins(cabins.map((c) => (c.id === item.id ? item : c)))}
            onDelete={(id) => setCabins(cabins.filter((c) => c.id !== id))}
            emptyDefaults={{ name: '', code: '', description: '' }}
            addLabel="Add Cabin"
          />
        </CardContent>
      </Card>
    </div>
  )
}
