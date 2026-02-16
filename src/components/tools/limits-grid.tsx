import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface LimitValue {
  perUser: number
  perCompany: number
}

export interface LimitRowConfig {
  key: string
  label: string
  description?: string
}

interface LimitsGridProps {
  rows: LimitRowConfig[]
  values: Record<string, LimitValue>
  onChange: (values: Record<string, LimitValue>) => void
}

export function LimitsGrid({ rows, values, onChange }: LimitsGridProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (key: string, field: 'perUser' | 'perCompany', raw: string) => {
    const num = raw === '' ? 0 : parseInt(raw, 10)
    if (isNaN(num) || num < 0) return

    const current = values[key] ?? { perUser: 0, perCompany: 0 }
    const updated = { ...current, [field]: num }

    // Validate perUser <= perCompany
    const newErrors = { ...errors }
    if (updated.perUser > updated.perCompany) {
      newErrors[key] = 'Per User cannot exceed Per Company'
    } else {
      delete newErrors[key]
    }
    setErrors(newErrors)

    onChange({ ...values, [key]: updated })
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium w-36">Per User</th>
            <th className="px-4 py-2 text-left font-medium w-36">Per Company</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const val = values[row.key] ?? { perUser: 0, perCompany: 0 }
            const error = errors[row.key]
            return (
              <tr key={row.key} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-2">
                  <div>
                    <span className="font-medium text-sm">{row.label}</span>
                    {row.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
                    )}
                    {error && (
                      <p className="text-xs text-destructive mt-0.5">{error}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min={0}
                    value={val.perUser}
                    onChange={(e) => handleChange(row.key, 'perUser', e.target.value)}
                    className={cn('h-8 w-28 font-mono text-sm', error && 'border-destructive')}
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min={0}
                    value={val.perCompany}
                    onChange={(e) => handleChange(row.key, 'perCompany', e.target.value)}
                    className="h-8 w-28 font-mono text-sm"
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
