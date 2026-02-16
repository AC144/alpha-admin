import { useState, useRef } from 'react'
import { Plus, Trash2, Pencil, Upload, ClipboardPaste, Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Types
interface FeeRule {
  id: string
  pcc: string
  cabin: 'ECO' | 'PRE' | 'BIZ' | 'FIR' | 'ANY'
  fareType: 'PRI' | 'PUB' | 'TOUR' | 'CORP' | 'ANY'
  tripType: 'OW' | 'RT' | 'ANY'
  airline: string
  split: number // Stored as decimal (0.90), displayed as percentage (90%)
  aggIssFee: number // Dollar amount
  isEditing?: boolean
}

interface IssuingFeesTabProps {
  companyId: string
}

// Dropdown options
const cabinOptions = [
  { value: 'ANY', label: 'Any' },
  { value: 'ECO', label: 'ECO (Economy)' },
  { value: 'PRE', label: 'PRE (Premium Economy)' },
  { value: 'BIZ', label: 'BIZ (Business)' },
  { value: 'FIR', label: 'FIR (First)' },
]

const fareTypeOptions = [
  { value: 'ANY', label: 'Any' },
  { value: 'PRI', label: 'PRI (Private)' },
  { value: 'PUB', label: 'PUB (Published)' },
  { value: 'TOUR', label: 'TOUR (Tour)' },
  { value: 'CORP', label: 'CORP (Corporate)' },
]

const tripTypeOptions = [
  { value: 'ANY', label: 'Any' },
  { value: 'OW', label: 'OW (One Way)' },
  { value: 'RT', label: 'RT (Round Trip)' },
]

// Common PCCs for combobox suggestions
const commonPccs = ['UE07', 'KN6G', '7AMG', 'U9XF', 'O77I', '3QOV', '8D8A']

// Common Airlines for combobox suggestions
const commonAirlines = ['AA', 'UA', 'DL', 'WN', 'AS', 'B6', 'NK', 'F9', 'G4', 'HA']

// Sample data
const sampleFeeRules: FeeRule[] = [
  { id: '1', pcc: 'UE07', cabin: 'PRE', fareType: 'TOUR', tripType: 'ANY', airline: '', split: 1.00, aggIssFee: 50.00 },
  { id: '2', pcc: 'KN6G', cabin: 'ECO', fareType: 'PRI', tripType: 'ANY', airline: '', split: 1.00, aggIssFee: 25.00 },
  { id: '3', pcc: '7AMG', cabin: 'ECO', fareType: 'CORP', tripType: 'OW', airline: '', split: 1.00, aggIssFee: 150.00 },
]

// Helper functions
const formatSplitForDisplay = (decimal: number): string => {
  return `${Math.round(decimal * 100)}%`
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

const parseCurrency = (value: string): number => {
  const num = parseFloat(value.replace(/[$,]/g, ''))
  return isNaN(num) ? 0 : num
}

// Combobox component for PCC and Airline
function Combobox({
  value,
  onChange,
  options,
  placeholder,
  maxLength,
  className,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  maxLength: number
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const filteredOptions = options.filter(
    (opt) => opt.toLowerCase().includes(inputValue.toLowerCase()) && opt !== inputValue
  )

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value.toUpperCase().slice(0, maxLength)
          setInputValue(val)
          onChange(val)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className={cn('h-8 font-mono', className)}
        maxLength={maxLength}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {filteredOptions.slice(0, 5).map((opt) => (
            <div
              key={opt}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              onMouseDown={() => {
                setInputValue(opt)
                onChange(opt)
                setIsOpen(false)
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function IssuingFeesTab({ companyId: _companyId }: IssuingFeesTabProps) {
  const [feeRules, setFeeRules] = useState<FeeRule[]>(sampleFeeRules)
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editingRow, setEditingRow] = useState<FeeRule | null>(null)
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null)
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [pasteData, setPasteData] = useState('')
  const [parsedRows, setParsedRows] = useState<FeeRule[]>([])
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add new empty row
  const addRow = () => {
    const newRow: FeeRule = {
      id: String(Date.now()),
      pcc: '',
      cabin: 'ANY',
      fareType: 'ANY',
      tripType: 'ANY',
      airline: '',
      split: 1.00,
      aggIssFee: 0,
      isEditing: true,
    }
    setFeeRules([...feeRules, newRow])
    setEditingRowId(newRow.id)
    setEditingRow(newRow)
  }

  // Start editing a row
  const startEditing = (rule: FeeRule) => {
    setEditingRowId(rule.id)
    setEditingRow({ ...rule })
  }

  // Save editing
  const saveEditing = () => {
    if (editingRow && editingRowId) {
      setFeeRules(feeRules.map((r) => (r.id === editingRowId ? { ...editingRow, isEditing: false } : r)))
      setEditingRowId(null)
      setEditingRow(null)
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    // If it was a new row (empty), remove it
    if (editingRow?.isEditing && !editingRow.pcc) {
      setFeeRules(feeRules.filter((r) => r.id !== editingRowId))
    }
    setEditingRowId(null)
    setEditingRow(null)
  }

  // Delete row
  const deleteRow = () => {
    if (deleteRowId) {
      setFeeRules(feeRules.filter((r) => r.id !== deleteRowId))
      setDeleteRowId(null)
    }
  }

  // Parse pasted data (tab-separated)
  const parsePastedData = (data: string): FeeRule[] => {
    const lines = data.trim().split('\n')
    const rows: FeeRule[] = []

    // Skip header row if present
    const startIndex = lines[0]?.toLowerCase().includes('pcc') ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const cols = lines[i].split('\t').map((c) => c.trim())
      if (cols.length >= 7) {
        const splitValue = parseFloat(cols[5]) || 1
        // If split is already decimal (< 1.01), use as is; otherwise convert from percentage
        const normalizedSplit = splitValue > 1.01 ? splitValue / 100 : splitValue

        const cabin = cols[1].toUpperCase()
        const fareType = cols[2].toUpperCase()
        const tripType = cols[3].toUpperCase()

        rows.push({
          id: String(Date.now() + i),
          pcc: cols[0].toUpperCase(),
          cabin: (cabin === '' || cabin === 'ANY' ? 'ANY' : cabin) as FeeRule['cabin'],
          fareType: (fareType === '' || fareType === 'ANY' ? 'ANY' : fareType) as FeeRule['fareType'],
          tripType: (tripType === '' || tripType === 'ANY' ? 'ANY' : tripType) as FeeRule['tripType'],
          airline: cols[4].toUpperCase(),
          split: normalizedSplit,
          aggIssFee: parseCurrency(cols[6]),
        })
      }
    }
    return rows
  }

  // Handle paste data processing
  const processPasteData = () => {
    const parsed = parsePastedData(pasteData)
    setParsedRows(parsed)
  }

  // Confirm import
  const confirmImport = () => {
    if (importMode === 'replace') {
      setFeeRules(parsedRows)
    } else {
      setFeeRules([...feeRules, ...parsedRows])
    }
    setIsPasteModalOpen(false)
    setIsUploadModalOpen(false)
    setPasteData('')
    setParsedRows([])
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string

      if (file.name.endsWith('.csv')) {
        // Convert CSV to tab-separated for parsing
        const tabSeparated = content.replace(/,/g, '\t')
        const parsed = parsePastedData(tabSeparated)
        setParsedRows(parsed)
      } else if (file.name.endsWith('.xml')) {
        // Basic XML parsing - would need more robust parsing for production
        // For now, just show a message
        alert('XML parsing not yet implemented. Please use CSV format.')
        return
      }
      setIsUploadModalOpen(true)
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const rowToDelete = feeRules.find((r) => r.id === deleteRowId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Issuing Fees</CardTitle>
              <CardDescription>
                Configure service fees and charges for ticket issuance.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPasteModalOpen(true)}>
                <ClipboardPaste className="mr-2 h-4 w-4" />
                Paste Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV/XML
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xml"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {feeRules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No fee rules configured. Add rows manually or upload/paste data.
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-3 text-left font-medium">PCC</th>
                      <th className="px-3 py-3 text-left font-medium">Cabin</th>
                      <th className="px-3 py-3 text-left font-medium">Fare Type</th>
                      <th className="px-3 py-3 text-left font-medium">Trip Type</th>
                      <th className="px-3 py-3 text-left font-medium">Airline</th>
                      <th className="px-3 py-3 text-left font-medium">Split</th>
                      <th className="px-3 py-3 text-left font-medium">Issuing Fee</th>
                      <th className="px-3 py-3 text-center font-medium w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeRules.map((rule) => {
                      const isEditing = editingRowId === rule.id

                      return (
                        <tr key={rule.id} className="border-b last:border-0 hover:bg-muted/30">
                          {isEditing && editingRow ? (
                            <>
                              <td className="px-3 py-2">
                                <Combobox
                                  value={editingRow.pcc}
                                  onChange={(val) => setEditingRow({ ...editingRow, pcc: val })}
                                  options={commonPccs}
                                  placeholder="PCC"
                                  maxLength={4}
                                  className="w-20"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Select
                                  value={editingRow.cabin}
                                  onValueChange={(val) => setEditingRow({ ...editingRow, cabin: val as FeeRule['cabin'] })}
                                >
                                  <SelectTrigger className="h-8 w-24">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {cabinOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-2">
                                <Select
                                  value={editingRow.fareType}
                                  onValueChange={(val) => setEditingRow({ ...editingRow, fareType: val as FeeRule['fareType'] })}
                                >
                                  <SelectTrigger className="h-8 w-24">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fareTypeOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-2">
                                <Select
                                  value={editingRow.tripType}
                                  onValueChange={(val) => setEditingRow({ ...editingRow, tripType: val as FeeRule['tripType'] })}
                                >
                                  <SelectTrigger className="h-8 w-20">
                                    <SelectValue placeholder="Any" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tripTypeOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-2">
                                <Combobox
                                  value={editingRow.airline}
                                  onChange={(val) => setEditingRow({ ...editingRow, airline: val })}
                                  options={commonAirlines}
                                  placeholder="Any"
                                  maxLength={2}
                                  className="w-16"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={Math.round(editingRow.split * 100)}
                                    onChange={(e) => setEditingRow({ ...editingRow, split: parseInt(e.target.value || '100', 10) / 100 })}
                                    className="h-8 w-16"
                                  />
                                  <span className="text-muted-foreground">%</span>
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">$</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editingRow.aggIssFee}
                                    onChange={(e) => setEditingRow({ ...editingRow, aggIssFee: parseFloat(e.target.value || '0') })}
                                    className="h-8 w-20"
                                  />
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={saveEditing}
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={cancelEditing}
                                  >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-3 py-2 font-mono">{rule.pcc}</td>
                              <td className="px-3 py-2">{rule.cabin === 'ANY' ? '-' : rule.cabin}</td>
                              <td className="px-3 py-2">{rule.fareType === 'ANY' ? '-' : rule.fareType}</td>
                              <td className="px-3 py-2">{rule.tripType === 'ANY' ? '-' : rule.tripType}</td>
                              <td className="px-3 py-2 font-mono">{rule.airline || '-'}</td>
                              <td className="px-3 py-2">{formatSplitForDisplay(rule.split)}</td>
                              <td className="px-3 py-2">{formatCurrency(rule.aggIssFee)}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => startEditing(rule)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setDeleteRowId(rule.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Showing {feeRules.length} fee rule{feeRules.length !== 1 ? 's' : ''}
                </span>
                <Button variant="outline" size="sm" onClick={addRow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
              </div>
            </>
          )}
          {feeRules.length === 0 && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={addRow}>
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>

      {/* Paste Data Modal */}
      <Dialog open={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Paste Data</DialogTitle>
            <DialogDescription>
              Paste spreadsheet data (tab-separated) from Google Sheets or Excel
            </DialogDescription>
          </DialogHeader>

          {parsedRows.length === 0 ? (
            <div className="space-y-4">
              <Textarea
                value={pasteData}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPasteData(e.target.value)}
                placeholder="Paste your data here..."
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Data should include columns: PCC, Cabin, Fare Type, Trip Type, Airline, Split, Issuing Fee
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  {parsedRows.length} row{parsedRows.length !== 1 ? 's' : ''} parsed successfully
                </p>
              </div>

              <div className="max-h-[200px] overflow-y-auto rounded border">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="px-2 py-1 text-left">PCC</th>
                      <th className="px-2 py-1 text-left">Cabin</th>
                      <th className="px-2 py-1 text-left">Fare</th>
                      <th className="px-2 py-1 text-left">Trip</th>
                      <th className="px-2 py-1 text-left">Airline</th>
                      <th className="px-2 py-1 text-left">Split</th>
                      <th className="px-2 py-1 text-left">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 10).map((row) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-2 py-1 font-mono">{row.pcc}</td>
                        <td className="px-2 py-1">{row.cabin}</td>
                        <td className="px-2 py-1">{row.fareType}</td>
                        <td className="px-2 py-1">{row.tripType || '-'}</td>
                        <td className="px-2 py-1">{row.airline || '-'}</td>
                        <td className="px-2 py-1">{formatSplitForDisplay(row.split)}</td>
                        <td className="px-2 py-1">{formatCurrency(row.aggIssFee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedRows.length > 10 && (
                  <div className="px-2 py-1 text-xs text-muted-foreground bg-muted">
                    ... and {parsedRows.length - 10} more rows
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Import mode</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-primary"
                    />
                    <span className="text-sm">Append to existing rows</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-primary"
                    />
                    <span className="text-sm">Replace all existing rows</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsPasteModalOpen(false)
              setPasteData('')
              setParsedRows([])
            }}>
              Cancel
            </Button>
            {parsedRows.length === 0 ? (
              <Button onClick={processPasteData} disabled={!pasteData.trim()}>
                Process
              </Button>
            ) : (
              <Button onClick={confirmImport}>
                Import {parsedRows.length} Row{parsedRows.length !== 1 ? 's' : ''}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Preview Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Preview</DialogTitle>
            <DialogDescription>
              Review the data before importing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                {parsedRows.length} row{parsedRows.length !== 1 ? 's' : ''} will be imported
              </p>
            </div>

            <div className="max-h-[200px] overflow-y-auto rounded border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="px-2 py-1 text-left">PCC</th>
                    <th className="px-2 py-1 text-left">Cabin</th>
                    <th className="px-2 py-1 text-left">Fare</th>
                    <th className="px-2 py-1 text-left">Trip</th>
                    <th className="px-2 py-1 text-left">Airline</th>
                    <th className="px-2 py-1 text-left">Split</th>
                    <th className="px-2 py-1 text-left">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 10).map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-2 py-1 font-mono">{row.pcc}</td>
                      <td className="px-2 py-1">{row.cabin}</td>
                      <td className="px-2 py-1">{row.fareType}</td>
                      <td className="px-2 py-1">{row.tripType || '-'}</td>
                      <td className="px-2 py-1">{row.airline || '-'}</td>
                      <td className="px-2 py-1">{formatSplitForDisplay(row.split)}</td>
                      <td className="px-2 py-1">{formatCurrency(row.aggIssFee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedRows.length > 10 && (
                <div className="px-2 py-1 text-xs text-muted-foreground bg-muted">
                  ... and {parsedRows.length - 10} more rows
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Import mode</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="text-primary"
                  />
                  <span className="text-sm">Append to existing rows</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-primary"
                  />
                  <span className="text-sm">Replace all existing rows</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUploadModalOpen(false)
              setParsedRows([])
            }}>
              Cancel
            </Button>
            <Button onClick={confirmImport}>
              Import {parsedRows.length} Row{parsedRows.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRowId} onOpenChange={(open) => !open && setDeleteRowId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fee Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this fee rule
              {rowToDelete?.pcc ? ` for PCC "${rowToDelete.pcc}"` : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteRow} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
