import { useState } from 'react'
import { Plus, Trash2, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { MultiChipCombobox } from '@/components/ui/multi-chip-combobox'

// Type definitions matching JSON structure
interface PricingRequest {
  id: string
  main_pcc: string
  secondary_pccs: string[]  // max 4
  ptc: string  // single value
  force_currency: string
  corporate_ids: string[]  // max 25
}

interface PricingAllTabProps {
  companyId: string
}

// Predefined options (will be populated from API/config later)
const PCC_OPTIONS = ['W4FF', 'JE6L', 'F85J', 'VV6K', 'U7JK', 'U9XF', '72BG', '5CJJ', 'L4FL', 'SP9L']

const PTC_OPTIONS = ['ADT', 'JCB', 'ITX', 'PFA', 'SEA']

const CORPORATE_ID_OPTIONS = [
  'OVA04', 'OVA24', 'CLB30', 'QFA50', 'UST10', 'ENT22', 'OVA23', 'EMT01',
  'BTC', 'ENT15', 'BKL18', 'ENT01', 'CLB15', 'UST05', 'EMT02', 'QFA25'
]

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY', 'MXN', 'BRL']

// Initial sample data
const initialRows: PricingRequest[] = [
  {
    id: '1',
    main_pcc: 'W4FF',
    secondary_pccs: ['JE6L', 'F85J', 'VV6K', 'U7JK'],
    ptc: 'ADT',
    force_currency: 'USD',
    corporate_ids: ['OVA04', 'CLB30', 'QFA50', 'ENT15', 'BKL18'],
  },
  {
    id: '2',
    main_pcc: 'U9XF',
    secondary_pccs: ['72BG'],
    ptc: 'ADT',
    force_currency: 'USD',
    corporate_ids: [],
  },
]

export function PricingAllTab({ companyId: _companyId }: PricingAllTabProps) {
  const [rows, setRows] = useState<PricingRequest[]>(initialRows)

  const addRow = () => {
    const newRow: PricingRequest = {
      id: String(Date.now()),
      main_pcc: '',
      secondary_pccs: [],
      ptc: 'ADT',
      force_currency: 'USD',
      corporate_ids: [],
    }
    setRows([...rows, newRow])
  }

  const updateRow = <K extends keyof PricingRequest>(
    id: string,
    field: K,
    value: PricingRequest[K]
  ) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Requests Configuration</CardTitle>
          <CardDescription>
            Configure pricing requests. Each row represents an independent pricing request that runs in parallel.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="rounded-lg border overflow-visible">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap">Main PCC *</th>
                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[180px]">
                      Secondary PCCs
                      <span className="text-xs text-muted-foreground ml-1">(max 4)</span>
                    </th>
                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap">PTC *</th>
                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[200px]">
                      Corporate IDs
                      <span className="text-xs text-muted-foreground ml-1">(max 25)</span>
                    </th>
                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap">Currency *</th>
                    <th className="px-3 py-3 text-center font-medium w-20 min-w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0 relative">
                      {/* Main PCC */}
                      <td className="px-3 py-2">
                        <Combobox
                          value={row.main_pcc}
                          onChange={(value) => updateRow(row.id, 'main_pcc', value)}
                          options={PCC_OPTIONS}
                          placeholder="PCC"
                          className="w-[90px]"
                          maxLength={4}
                          uppercase
                          error={!row.main_pcc}
                        />
                      </td>

                      {/* Secondary PCCs */}
                      <td className="px-3 py-2">
                        <MultiChipCombobox
                          value={row.secondary_pccs}
                          onChange={(value) => updateRow(row.id, 'secondary_pccs', value)}
                          options={PCC_OPTIONS}
                          placeholder="Add PCCs"
                          maxItems={4}
                          maxLength={4}
                          uppercase
                          className="min-w-[160px]"
                        />
                      </td>

                      {/* PTC - Single select */}
                      <td className="px-3 py-2">
                        <Combobox
                          value={row.ptc}
                          onChange={(value) => updateRow(row.id, 'ptc', value)}
                          options={PTC_OPTIONS}
                          placeholder="PTC"
                          className="w-[85px]"
                          maxLength={3}
                          uppercase
                          error={!row.ptc}
                          allowCustom={false}
                        />
                      </td>

                      {/* Corporate IDs */}
                      <td className="px-3 py-2">
                        <MultiChipCombobox
                          value={row.corporate_ids}
                          onChange={(value) => updateRow(row.id, 'corporate_ids', value)}
                          options={CORPORATE_ID_OPTIONS}
                          placeholder="Add Corp IDs"
                          maxItems={25}
                          uppercase
                          condensedView
                          condensedThreshold={3}
                          className="min-w-[180px]"
                        />
                      </td>

                      {/* Currency */}
                      <td className="px-3 py-2 overflow-hidden">
                        <div className="w-[85px]">
                          <Combobox
                            value={row.force_currency}
                            onChange={(value) => updateRow(row.id, 'force_currency', value)}
                            options={CURRENCY_OPTIONS}
                            placeholder="USD"
                            className="w-full"
                            maxLength={3}
                            uppercase
                            error={!row.force_currency}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('Settings for row:', row.id)
                            }}
                            title="Settings"
                          >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            type="button"
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const rowId = row.id
                              const hasData = row.main_pcc || row.secondary_pccs.length > 0 || row.corporate_ids.length > 0
                              if (hasData) {
                                if (window.confirm('This row has data. Are you sure you want to delete it?')) {
                                  setRows((currentRows) => currentRows.filter((r) => r.id !== rowId))
                                }
                              } else {
                                setRows((currentRows) => currentRows.filter((r) => r.id !== rowId))
                              }
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4 border-dashed relative z-0"
            onClick={addRow}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Pricing Request
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
