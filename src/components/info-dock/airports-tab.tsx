import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronRight, Pencil, Trash2, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import type { Airport } from '@/types/info-dock'

// Sample airport data (13 fields each)
const sampleAirports: Airport[] = [
  { id: 'NYC', displayname: 'All Airports, New York, United States, (NYC)', airportname: 'All Airports', cityonly: 'New York', country: 'United States', cc: 'US', region: 'New York', rc: 'NY', lat: 40.75096, lng: -73.98741, timezone: 'America/New_York', utc: '-05:00', loctype: 'metro', isMetroOnly: true },
  { id: 'JFK', displayname: 'John F Kennedy Intl, New York, United States, (JFK)', airportname: 'John F Kennedy Intl', cityonly: 'New York', country: 'United States', cc: 'US', region: 'New York', rc: 'NY', lat: 40.63983, lng: -73.77874, timezone: 'America/New_York', utc: '-05:00', loctype: 'ap', isMetroOnly: false },
  { id: 'LGA', displayname: 'LaGuardia, New York, United States, (LGA)', airportname: 'LaGuardia', cityonly: 'New York', country: 'United States', cc: 'US', region: 'New York', rc: 'NY', lat: 40.77720, lng: -73.87260, timezone: 'America/New_York', utc: '-05:00', loctype: 'ap', isMetroOnly: false },
  { id: 'EWR', displayname: 'Newark Liberty Intl, Newark, United States, (EWR)', airportname: 'Newark Liberty Intl', cityonly: 'Newark', country: 'United States', cc: 'US', region: 'New Jersey', rc: 'NJ', lat: 40.68950, lng: -74.17450, timezone: 'America/New_York', utc: '-05:00', loctype: 'ap', isMetroOnly: false },
  { id: 'LAX', displayname: 'Los Angeles Intl, Los Angeles, United States, (LAX)', airportname: 'Los Angeles Intl', cityonly: 'Los Angeles', country: 'United States', cc: 'US', region: 'California', rc: 'CA', lat: 33.94250, lng: -118.40810, timezone: 'America/Los_Angeles', utc: '-08:00', loctype: 'ap', isMetroOnly: false },
  { id: 'ORD', displayname: "O'Hare Intl, Chicago, United States, (ORD)", airportname: "O'Hare Intl", cityonly: 'Chicago', country: 'United States', cc: 'US', region: 'Illinois', rc: 'IL', lat: 41.97420, lng: -87.90730, timezone: 'America/Chicago', utc: '-06:00', loctype: 'ap', isMetroOnly: false },
  { id: 'LHR', displayname: 'Heathrow, London, United Kingdom, (LHR)', airportname: 'Heathrow', cityonly: 'London', country: 'United Kingdom', cc: 'GB', region: 'England', rc: 'EN', lat: 51.47000, lng: -0.45430, timezone: 'Europe/London', utc: '+00:00', loctype: 'ap', isMetroOnly: false },
  { id: 'CDG', displayname: 'Charles de Gaulle, Paris, France, (CDG)', airportname: 'Charles de Gaulle', cityonly: 'Paris', country: 'France', cc: 'FR', region: 'Ile-de-France', rc: 'IF', lat: 49.00970, lng: 2.54790, timezone: 'Europe/Paris', utc: '+01:00', loctype: 'ap', isMetroOnly: false },
  { id: 'DXB', displayname: 'Dubai Intl, Dubai, UAE, (DXB)', airportname: 'Dubai Intl', cityonly: 'Dubai', country: 'UAE', cc: 'AE', region: 'Dubai', rc: 'DU', lat: 25.25320, lng: 55.36570, timezone: 'Asia/Dubai', utc: '+04:00', loctype: 'ap', isMetroOnly: false },
  { id: 'NRT', displayname: 'Narita Intl, Tokyo, Japan, (NRT)', airportname: 'Narita Intl', cityonly: 'Tokyo', country: 'Japan', cc: 'JP', region: 'Kanto', rc: 'KT', lat: 35.76470, lng: 140.38640, timezone: 'Asia/Tokyo', utc: '+09:00', loctype: 'ap', isMetroOnly: false },
  { id: 'SIN', displayname: 'Changi, Singapore, Singapore, (SIN)', airportname: 'Changi', cityonly: 'Singapore', country: 'Singapore', cc: 'SG', region: 'Singapore', rc: 'SG', lat: 1.36440, lng: 103.99150, timezone: 'Asia/Singapore', utc: '+08:00', loctype: 'ap', isMetroOnly: false },
  { id: 'SYD', displayname: 'Kingsford Smith, Sydney, Australia, (SYD)', airportname: 'Kingsford Smith', cityonly: 'Sydney', country: 'Australia', cc: 'AU', region: 'New South Wales', rc: 'NS', lat: -33.94610, lng: 151.17720, timezone: 'Australia/Sydney', utc: '+11:00', loctype: 'ap', isMetroOnly: false },
]

const PAGE_SIZE = 20

// All 13 fields for expanded detail view
const detailFields: { key: keyof Airport; label: string }[] = [
  { key: 'id', label: 'Code' },
  { key: 'displayname', label: 'Display Name' },
  { key: 'airportname', label: 'Airport Name' },
  { key: 'cityonly', label: 'City' },
  { key: 'country', label: 'Country' },
  { key: 'cc', label: 'Country Code' },
  { key: 'region', label: 'Region' },
  { key: 'rc', label: 'Region Code' },
  { key: 'lat', label: 'Latitude' },
  { key: 'lng', label: 'Longitude' },
  { key: 'timezone', label: 'Timezone (IANA)' },
  { key: 'utc', label: 'UTC Offset' },
  { key: 'loctype', label: 'Location Type' },
]

export function AirportsTab() {
  const [airports, setAirports] = useState<Airport[]>(sampleAirports)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Airport | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [importPreview, setImportPreview] = useState(false)
  const [importData, setImportData] = useState<Airport[]>([])

  const filtered = useMemo(() => {
    if (!search) return airports
    const lower = search.toLowerCase()
    return airports.filter(
      (a) =>
        a.id.toLowerCase().includes(lower) ||
        a.airportname.toLowerCase().includes(lower) ||
        a.cityonly.toLowerCase().includes(lower) ||
        a.country.toLowerCase().includes(lower) ||
        a.cc.toLowerCase().includes(lower) ||
        a.displayname.toLowerCase().includes(lower)
    )
  }, [airports, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleImport = (_file: File) => {
    // Mock import - production would parse XLSX
    setImportData([])
    setImportPreview(true)
  }

  const handleExport = () => {
    const csv = [
      'Code,Name,City,Country,CC,Region,RC,Lat,Lng,Timezone,UTC,Type,IsMetroOnly',
      ...airports.map((a) =>
        `${a.id},"${a.airportname}","${a.cityonly}","${a.country}",${a.cc},"${a.region}",${a.rc},${a.lat},${a.lng},${a.timezone},${a.utc},${a.loctype},${a.isMetroOnly}`
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'airports.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const confirmImport = () => {
    if (importData.length > 0) {
      setAirports(importData)
    }
    setImportPreview(false)
    setImportData([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Airports</CardTitle>
              <CardDescription>Airport reference data</CardDescription>
            </div>
            <ImportExportToolbar onImport={handleImport} onExport={handleExport} />
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
              placeholder="Search airports..."
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 w-8"></th>
                  <th className="px-3 py-2 text-left font-medium w-16">Code</th>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">City</th>
                  <th className="px-3 py-2 text-left font-medium w-16">Country</th>
                  <th className="px-3 py-2 text-left font-medium w-20">Timezone</th>
                  <th className="px-3 py-2 text-left font-medium w-20">Type</th>
                  <th className="px-3 py-2 text-center font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((airport) => {
                  const isExpanded = expandedId === airport.id
                  const isEditing = editingId === airport.id
                  return (
                    <>
                      <tr
                        key={airport.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td
                          className="px-3 py-2 cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : airport.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                        {isEditing && editingData ? (
                          <>
                            <td className="px-3 py-2">
                              <Input value={editingData.id} onChange={(e) => setEditingData({ ...editingData, id: e.target.value.toUpperCase() })} className="h-8 w-16 font-mono" maxLength={4} />
                            </td>
                            <td className="px-3 py-2">
                              <Input value={editingData.airportname} onChange={(e) => setEditingData({ ...editingData, airportname: e.target.value })} className="h-8" />
                            </td>
                            <td className="px-3 py-2">
                              <Input value={editingData.cityonly} onChange={(e) => setEditingData({ ...editingData, cityonly: e.target.value })} className="h-8" />
                            </td>
                            <td className="px-3 py-2">
                              <Input value={editingData.cc} onChange={(e) => setEditingData({ ...editingData, cc: e.target.value.toUpperCase() })} className="h-8 w-14 font-mono" maxLength={2} />
                            </td>
                            <td className="px-3 py-2">
                              <Input value={editingData.utc} onChange={(e) => setEditingData({ ...editingData, utc: e.target.value })} className="h-8 w-20 font-mono text-xs" />
                            </td>
                            <td className="px-3 py-2">
                              <Input value={editingData.loctype} onChange={(e) => setEditingData({ ...editingData, loctype: e.target.value })} className="h-8 w-16 font-mono" />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 font-mono font-medium cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : airport.id)}>{airport.id}</td>
                            <td className="px-3 py-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : airport.id)}>{airport.airportname}</td>
                            <td className="px-3 py-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : airport.id)}>{airport.cityonly}</td>
                            <td className="px-3 py-2 font-mono cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : airport.id)}>{airport.cc}</td>
                            <td className="px-3 py-2 text-xs font-mono cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : airport.id)}>{airport.utc}</td>
                            <td className="px-3 py-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : airport.id)}>
                              <Badge variant={airport.isMetroOnly ? 'secondary' : 'outline'} className="text-xs">
                                {airport.loctype}
                              </Badge>
                            </td>
                          </>
                        )}
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-1">
                            {isEditing ? (
                              <>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAirports(airports.map((a) => (a.id === editingId ? editingData! : a))); setEditingId(null); setEditingData(null) }}>
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(null); setEditingData(null) }}>
                                  <X className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(airport.id); setEditingData({ ...airport }) }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(airport.id)}>
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && !isEditing && (
                        <tr key={`${airport.id}-detail`} className="border-b bg-muted/10">
                          <td colSpan={8} className="px-6 py-3">
                            <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-xs">
                              {detailFields.map(({ key, label }) => (
                                <div key={key}>
                                  <span className="text-muted-foreground">{label}:</span>{' '}
                                  <span className="font-mono">{String(airport[key])}</span>
                                </div>
                              ))}
                              <div>
                                <span className="text-muted-foreground">Metro Only:</span>{' '}
                                <span className="font-mono">{airport.isMetroOnly ? 'true' : 'false'}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                      No airports found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Airport</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete airport &quot;{airports.find((a) => a.id === deleteId)?.id} - {airports.find((a) => a.id === deleteId)?.airportname}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setAirports(airports.filter((a) => a.id !== deleteId)); setDeleteId(null) }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
        title="Import Airports"
        newCount={importData.length}
        updatedCount={0}
        unchangedCount={0}
        errorCount={0}
        previewColumns={['Code', 'Name', 'City', 'Country', 'Type']}
        previewRows={importData.map((a) => ({ Code: a.id, Name: a.airportname, City: a.cityonly, Country: a.cc, Type: a.loctype }))}
      />
    </div>
  )
}
