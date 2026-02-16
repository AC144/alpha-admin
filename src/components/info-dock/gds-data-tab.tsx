import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EditableTable, type ColumnDef } from './editable-table'
import type { GDS, PCC, PTC, CorpID } from '@/types/info-dock'

// Sample data
const sampleGdsList: GDS[] = [
  { id: '1', type: 'Standard', name: 'Sabre', description: 'Primary GDS' },
  { id: '2', type: 'Standard', name: 'Amadeus', description: 'European GDS' },
  { id: '3', type: 'Alternative', name: 'Travelport', description: 'Galileo/Apollo/Worldspan' },
]

const samplePccs: PCC[] = [
  { id: '1', gdsId: '1', code: 'U9XF', description: 'Main office PCC' },
  { id: '2', gdsId: '1', code: 'VV6K', description: 'Branch office' },
  { id: '3', gdsId: '1', code: 'SP9L', description: 'Remote office' },
  { id: '4', gdsId: '2', code: 'AMAD', description: 'Amadeus main PCC' },
]

const samplePtcs: PTC[] = [
  { id: '1', gdsId: '1', adult: 'ADT', child: 'CNN', infant: 'INF', infantWithSeat: 'INS' },
  { id: '2', gdsId: '2', adult: 'ADT', child: 'CHD', infant: 'INF', infantWithSeat: 'INS' },
]

const sampleCorpIds: CorpID[] = [
  { id: '1', gdsId: '1', code: 'CORP01', description: 'Travel Pelicans corporate' },
  { id: '2', gdsId: '1', code: 'CORP02', description: 'Partner agency' },
]

const gdsColumns: ColumnDef<GDS>[] = [
  { key: 'type', header: 'Type', placeholder: 'Standard', width: '120px' },
  { key: 'name', header: 'Name', placeholder: 'GDS Name' },
  { key: 'description', header: 'Description', placeholder: 'Description' },
]

const pccColumns: ColumnDef<PCC>[] = [
  { key: 'code', header: 'Code', placeholder: 'XXXX', maxLength: 4, width: '100px' },
  { key: 'description', header: 'Description', placeholder: 'Description' },
]

const corpIdColumns: ColumnDef<CorpID>[] = [
  { key: 'code', header: 'Code', placeholder: 'CORPXX', width: '120px' },
  { key: 'description', header: 'Description', placeholder: 'Description' },
]

const ptcLabels = [
  { key: 'adult' as const, label: 'Adult' },
  { key: 'child' as const, label: 'Child' },
  { key: 'infant' as const, label: 'Infant' },
  { key: 'infantWithSeat' as const, label: 'Infant w/ Seat' },
]

// PTC Matrix Component
function PtcMatrix({
  ptcs,
  gdsId,
  onAdd,
  onUpdate,
  onDelete,
}: {
  ptcs: PTC[]
  gdsId: string
  onAdd: (ptc: PTC) => void
  onUpdate: (ptc: PTC) => void
  onDelete: (id: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<PTC | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newPtc, setNewPtc] = useState<Omit<PTC, 'id'>>({ gdsId, adult: '', child: '', infant: '', infantWithSeat: '' })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const startAdding = () => {
    setIsAdding(true)
    setNewPtc({ gdsId, adult: '', child: '', infant: '', infantWithSeat: '' })
  }

  const saveNew = () => {
    onAdd({ ...newPtc, id: String(Date.now()) } as PTC)
    setIsAdding(false)
  }

  const startEditing = (ptc: PTC) => {
    setEditingId(ptc.id)
    setEditingData({ ...ptc })
  }

  const saveEditing = () => {
    if (editingData) {
      onUpdate(editingData)
      setEditingId(null)
      setEditingData(null)
    }
  }

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">PTC</h3>
        <Button variant="outline" size="sm" onClick={startAdding} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" />
          Add PTC
        </Button>
      </div>

      <div className="space-y-3">
        {ptcs.map((ptc) => {
          const isEditing = editingId === ptc.id

          return (
            <div key={ptc.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-4 gap-4 flex-1">
                  {ptcLabels.map(({ key, label }) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">{label}</div>
                      {isEditing ? (
                        <Input
                          value={editingData?.[key] ?? ''}
                          onChange={(e) =>
                            setEditingData({ ...editingData!, [key]: e.target.value.toUpperCase() })
                          }
                          className="h-8 text-center font-mono"
                          maxLength={5}
                          placeholder="XXX"
                        />
                      ) : (
                        <div className="font-mono font-medium text-sm">{ptc[key]}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-3">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveEditing}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(null); setEditingData(null) }}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditing(ptc)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(ptc.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Add new PTC row */}
        {isAdding && (
          <div className="rounded-lg border border-dashed p-3 bg-muted/10">
            <div className="flex items-start justify-between">
              <div className="grid grid-cols-4 gap-4 flex-1">
                {ptcLabels.map(({ key, label }) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{label}</div>
                    <Input
                      value={newPtc[key]}
                      onChange={(e) =>
                        setNewPtc({ ...newPtc, [key]: e.target.value.toUpperCase() })
                      }
                      className="h-8 text-center font-mono"
                      maxLength={5}
                      placeholder="XXX"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 ml-3">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveNew}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {ptcs.length === 0 && !isAdding && (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            No PTC records. Click &quot;Add PTC&quot; to add one.
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PTC Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this PTC record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function GdsDataTab() {
  const [gdsList, setGdsList] = useState<GDS[]>(sampleGdsList)
  const [pccs, setPccs] = useState<PCC[]>(samplePccs)
  const [ptcs, setPtcs] = useState<PTC[]>(samplePtcs)
  const [corpIds, setCorpIds] = useState<CorpID[]>(sampleCorpIds)
  const [selectedGdsId, setSelectedGdsId] = useState<string>(gdsList[0]?.id || '')

  const filteredPccs = pccs.filter((p) => p.gdsId === selectedGdsId)
  const filteredPtcs = ptcs.filter((p) => p.gdsId === selectedGdsId)
  const filteredCorpIds = corpIds.filter((c) => c.gdsId === selectedGdsId)
  const selectedGds = gdsList.find((g) => g.id === selectedGdsId)

  return (
    <div className="space-y-6">
      {/* GDS List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GDS List</CardTitle>
          <CardDescription>Manage Global Distribution Systems</CardDescription>
        </CardHeader>
        <CardContent>
          <EditableTable
            title=""
            columns={gdsColumns}
            data={gdsList}
            onAdd={(item) => {
              const newGds: GDS = { id: String(Date.now()), ...item } as GDS
              setGdsList([...gdsList, newGds])
            }}
            onUpdate={(item) => setGdsList(gdsList.map((g) => (g.id === item.id ? item : g)))}
            onDelete={(id) => setGdsList(gdsList.filter((g) => g.id !== id))}
            emptyDefaults={{ type: '', name: '', description: '' }}
            addLabel="Add GDS"
          />
        </CardContent>
      </Card>

      {/* GDS-dependent sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GDS Configuration</CardTitle>
          <CardDescription>Select a GDS to manage its PCCs, PTCs, and Corp IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GDS Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">GDS:</span>
            <Select value={selectedGdsId} onValueChange={setSelectedGdsId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select GDS" />
              </SelectTrigger>
              <SelectContent>
                {gdsList.map((gds) => (
                  <SelectItem key={gds.id} value={gds.id}>
                    {gds.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedGds && (
              <span className="text-sm text-muted-foreground">({selectedGds.type})</span>
            )}
          </div>

          {selectedGdsId && (
            <>
              {/* PCCs */}
              <EditableTable
                title="PCC"
                columns={pccColumns}
                data={filteredPccs}
                onAdd={(item) => {
                  const newPcc: PCC = { ...item, id: String(Date.now()), gdsId: selectedGdsId } as PCC
                  setPccs([...pccs, newPcc])
                }}
                onUpdate={(item) => setPccs(pccs.map((p) => (p.id === item.id ? item : p)))}
                onDelete={(id) => setPccs(pccs.filter((p) => p.id !== id))}
                emptyDefaults={{ gdsId: selectedGdsId, code: '', description: '' }}
                addLabel="Add PCC"
              />

              {/* PTCs - Horizontal Matrix */}
              <PtcMatrix
                ptcs={filteredPtcs}
                gdsId={selectedGdsId}
                onAdd={(ptc) => setPtcs([...ptcs, ptc])}
                onUpdate={(ptc) => setPtcs(ptcs.map((p) => (p.id === ptc.id ? ptc : p)))}
                onDelete={(id) => setPtcs(ptcs.filter((p) => p.id !== id))}
              />

              {/* Corp IDs */}
              <EditableTable
                title="Corp IDs"
                columns={corpIdColumns}
                data={filteredCorpIds}
                onAdd={(item) => {
                  const newCorpId: CorpID = { ...item, id: String(Date.now()), gdsId: selectedGdsId } as CorpID
                  setCorpIds([...corpIds, newCorpId])
                }}
                onUpdate={(item) => setCorpIds(corpIds.map((c) => (c.id === item.id ? item : c)))}
                onDelete={(id) => setCorpIds(corpIds.filter((c) => c.id !== id))}
                emptyDefaults={{ gdsId: selectedGdsId, code: '', description: '' }}
                addLabel="Add Corp ID"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
