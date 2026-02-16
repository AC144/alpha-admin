import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Check, X, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
import { ImportExportToolbar } from './import-export-toolbar'
import { ImportPreviewDialog } from './import-preview-dialog'
import type { Airline } from '@/types/info-dock'

// Sample airline data
const sampleAirlines: Airline[] = [
  { id: '1', name: 'American Airlines', iataCode: 'AA', country: 'US', active: true },
  { id: '2', name: 'Delta Air Lines', iataCode: 'DL', country: 'US', active: true },
  { id: '3', name: 'United Airlines', iataCode: 'UA', country: 'US', active: true },
  { id: '4', name: 'Southwest Airlines', iataCode: 'WN', country: 'US', active: true },
  { id: '5', name: 'JetBlue Airways', iataCode: 'B6', country: 'US', active: true },
  { id: '6', name: 'Alaska Airlines', iataCode: 'AS', country: 'US', active: true },
  { id: '7', name: 'Spirit Airlines', iataCode: 'NK', country: 'US', active: true },
  { id: '8', name: 'Frontier Airlines', iataCode: 'F9', country: 'US', active: true },
  { id: '9', name: 'Lufthansa', iataCode: 'LH', country: 'Germany', active: true },
  { id: '10', name: 'Air France', iataCode: 'AF', country: 'France', active: true },
  { id: '11', name: 'British Airways', iataCode: 'BA', country: 'United Kingdom', active: true },
  { id: '12', name: 'Emirates', iataCode: 'EK', country: 'UAE', active: true },
  { id: '13', name: 'Qatar Airways', iataCode: 'QR', country: 'Qatar', active: true },
  { id: '14', name: 'Singapore Airlines', iataCode: 'SQ', country: 'Singapore', active: true },
  { id: '15', name: 'Cathay Pacific', iataCode: 'CX', country: 'Hong Kong', active: true },
  { id: '16', name: 'ANA', iataCode: 'NH', country: 'Japan', active: true },
  { id: '17', name: 'KLM', iataCode: 'KL', country: 'Netherlands', active: true },
  { id: '18', name: 'Turkish Airlines', iataCode: 'TK', country: 'Turkey', active: true },
  { id: '19', name: 'Qantas', iataCode: 'QF', country: 'Australia', active: true },
  { id: '20', name: 'Air Canada', iataCode: 'AC', country: 'Canada', active: true },
  { id: '21', name: 'LATAM Airlines', iataCode: 'LA', country: 'Chile', active: true },
  { id: '22', name: 'Avianca', iataCode: 'AV', country: 'Colombia', active: true },
  { id: '23', name: 'Ethiopian Airlines', iataCode: 'ET', country: 'Ethiopia', active: true },
  { id: '24', name: 'Korean Air', iataCode: 'KE', country: 'South Korea', active: true },
  { id: '25', name: 'Swiss International', iataCode: 'LX', country: 'Switzerland', active: true },
]

const PAGE_SIZE = 20

export function AirlinesTab() {
  const [airlines, setAirlines] = useState<Airline[]>(sampleAirlines)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Airline | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newAirline, setNewAirline] = useState({ name: '', iataCode: '', country: '', active: true })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [importPreview, setImportPreview] = useState(false)
  const [importData, setImportData] = useState<Airline[]>([])

  const filtered = useMemo(() => {
    if (!search) return airlines
    const lower = search.toLowerCase()
    return airlines.filter(
      (a) =>
        a.name.toLowerCase().includes(lower) ||
        a.iataCode.toLowerCase().includes(lower) ||
        a.country.toLowerCase().includes(lower)
    )
  }, [airlines, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleImport = (_file: File) => {
    // Mock import - in production would parse XLSX
    const mockImported: Airline[] = [
      { id: String(Date.now()), name: 'New Airline', iataCode: 'NA', country: 'US', active: true },
    ]
    setImportData(mockImported)
    setImportPreview(true)
  }

  const handleExport = () => {
    // Mock export - in production would generate XLSX
    const csv = ['Name,IATA Code,Country,Active', ...airlines.map((a) => `${a.name},${a.iataCode},${a.country},${a.active}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'airlines.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const confirmImport = () => {
    setAirlines([...airlines, ...importData])
    setImportPreview(false)
    setImportData([])
  }

  const deleteRow = airlines.find((a) => a.id === deleteId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Airlines</CardTitle>
              <CardDescription>Manage airline records with IATA codes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ImportExportToolbar onImport={handleImport} onExport={handleExport} />
              <Button
                size="sm"
                onClick={() => {
                  setIsAdding(true)
                  setNewAirline({ name: '', iataCode: '', country: '', active: true })
                }}
                disabled={isAdding}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Airline
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search airlines..."
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium w-20">IATA</th>
                  <th className="px-3 py-2 text-left font-medium">Country</th>
                  <th className="px-3 py-2 text-center font-medium w-20">Active</th>
                  <th className="px-3 py-2 text-center font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((airline) => {
                  const isEditing = editingId === airline.id
                  return (
                    <tr key={airline.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <Input value={editingData?.name ?? ''} onChange={(e) => setEditingData({ ...editingData!, name: e.target.value })} className="h-8" />
                        ) : (
                          airline.name
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {isEditing ? (
                          <Input value={editingData?.iataCode ?? ''} onChange={(e) => setEditingData({ ...editingData!, iataCode: e.target.value.toUpperCase() })} className="h-8 w-16" maxLength={2} />
                        ) : (
                          airline.iataCode
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <Input value={editingData?.country ?? ''} onChange={(e) => setEditingData({ ...editingData!, country: e.target.value })} className="h-8" />
                        ) : (
                          airline.country
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {isEditing ? (
                          <Switch checked={editingData?.active ?? true} onCheckedChange={(checked) => setEditingData({ ...editingData!, active: checked })} />
                        ) : (
                          <span className={airline.active ? 'text-green-600' : 'text-muted-foreground'}>{airline.active ? 'Yes' : 'No'}</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          {isEditing ? (
                            <>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAirlines(airlines.map((a) => (a.id === editingId ? editingData! : a))); setEditingId(null); setEditingData(null) }}>
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(null); setEditingData(null) }}>
                                <X className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(airline.id); setEditingData({ ...airline }) }}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(airline.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {/* Add new row */}
                {isAdding && (
                  <tr className="border-b last:border-0 bg-muted/10">
                    <td className="px-3 py-2">
                      <Input value={newAirline.name} onChange={(e) => setNewAirline({ ...newAirline, name: e.target.value })} className="h-8" placeholder="Airline name" />
                    </td>
                    <td className="px-3 py-2">
                      <Input value={newAirline.iataCode} onChange={(e) => setNewAirline({ ...newAirline, iataCode: e.target.value.toUpperCase() })} className="h-8 w-16" maxLength={2} placeholder="XX" />
                    </td>
                    <td className="px-3 py-2">
                      <Input value={newAirline.country} onChange={(e) => setNewAirline({ ...newAirline, country: e.target.value })} className="h-8" placeholder="Country" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Switch checked={newAirline.active} onCheckedChange={(checked) => setNewAirline({ ...newAirline, active: checked })} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAirlines([...airlines, { id: String(Date.now()), ...newAirline }]); setIsAdding(false) }}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAdding(false)}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Airline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{deleteRow ? ` "${deleteRow.name} (${deleteRow.iataCode})"` : ' this airline'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setAirlines(airlines.filter((a) => a.id !== deleteId)); setDeleteId(null) }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Preview */}
      <ImportPreviewDialog
        open={importPreview}
        onOpenChange={setImportPreview}
        onConfirm={confirmImport}
        title="Import Airlines"
        newCount={importData.length}
        updatedCount={0}
        unchangedCount={0}
        errorCount={0}
        previewColumns={['Name', 'IATA', 'Country', 'Active']}
        previewRows={importData.map((a) => ({ Name: a.name, IATA: a.iataCode, Country: a.country, Active: a.active ? 'Yes' : 'No' }))}
      />
    </div>
  )
}
