import { useState, useRef, type KeyboardEvent } from 'react'
import { Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RowSettingsPopover } from './row-settings-popover'
import { CorpIdsOverflow } from './corp-ids-overflow'

export interface SearchRequest {
  id: string
  ptc: string
  mainPcc: string
  secondaryPccs: string[]
  corporateIds: string[]
  currency: string
  ndc: boolean
}

interface SearchRequestRowProps {
  request: SearchRequest
  onChange: (updated: SearchRequest) => void
  onDelete: () => void
}

// Compact PCC tag input with max support
function PccTagInputCompact({
  value,
  onChange,
  max = 4,
  disabled = false,
}: {
  value: string[]
  onChange: (value: string[]) => void
  max?: number
  disabled?: boolean
}) {
  const [inputValue, setInputValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatInput = (input: string): string => {
    return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
  }

  const addTag = () => {
    const formatted = formatInput(inputValue)
    if (/^[A-Z0-9]{4}$/.test(formatted) && !value.includes(formatted) && value.length < max) {
      onChange([...value, formatted])
      setInputValue('')
      setIsInvalid(false)
    } else if (inputValue.length > 0) {
      setIsInvalid(true)
      setTimeout(() => setIsInvalid(false), 500)
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-lg border bg-background px-2 py-1.5 min-h-[36px] cursor-text',
        isInvalid ? 'border-destructive' : 'border-input',
        disabled && 'opacity-50 cursor-not-allowed bg-muted'
      )}
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded bg-secondary border border-input px-1.5 py-0.5 text-xs font-mono"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(index) }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      {!disabled && value.length < max && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(formatInput(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue.length === 4) addTag() }}
          placeholder={value.length === 0 ? 'Add PCC...' : ''}
          disabled={disabled}
          className="flex-1 min-w-[60px] bg-transparent outline-none text-xs font-mono placeholder:text-muted-foreground"
        />
      )}

      <span className="ml-auto text-[10px] text-muted-foreground whitespace-nowrap">
        {disabled ? 'NDC' : `${value.length}/${max}`}
      </span>
    </div>
  )
}

export function SearchRequestRow({ request, onChange, onDelete }: SearchRequestRowProps) {
  const update = <K extends keyof SearchRequest>(key: K, val: SearchRequest[K]) => {
    onChange({ ...request, [key]: val })
  }

  const handleNdcChange = (ndc: boolean) => {
    onChange({
      ...request,
      ndc,
      secondaryPccs: ndc ? [] : request.secondaryPccs,
      corporateIds: ndc ? [] : request.corporateIds,
    })
  }

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30">
      {/* Main PCC */}
      <td className="px-3 py-2">
        <Input
          value={request.mainPcc}
          onChange={(e) => update('mainPcc', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))}
          className="h-8 w-20 font-mono text-sm"
          placeholder="XXXX"
          maxLength={4}
        />
      </td>

      {/* Secondary PCCs */}
      <td className="px-3 py-2">
        <div className="min-w-[200px]">
          <PccTagInputCompact
            value={request.secondaryPccs}
            onChange={(val) => update('secondaryPccs', val)}
            max={4}
            disabled={request.ndc}
          />
        </div>
      </td>

      {/* PTC */}
      <td className="px-3 py-2">
        <Input
          value={request.ptc}
          onChange={(e) => update('ptc', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3))}
          className="h-8 w-16 font-mono text-sm"
          placeholder="XXX"
          maxLength={3}
        />
      </td>

      {/* Corporate IDs */}
      <td className="px-3 py-2">
        <div className="min-w-[220px]">
          <CorpIdsOverflow
            value={request.corporateIds}
            onChange={(val) => update('corporateIds', val)}
            max={25}
            visibleCount={3}
            disabled={request.ndc}
          />
        </div>
      </td>

      {/* Currency */}
      <td className="px-3 py-2">
        <Input
          value={request.currency}
          onChange={(e) => update('currency', e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
          className="h-8 w-16 font-mono text-sm"
          placeholder="USD"
          maxLength={3}
        />
      </td>

      {/* Actions */}
      <td className="px-3 py-2">
        <div className="flex items-center justify-center gap-1">
          {request.ndc && (
            <Badge variant="secondary" className="text-[10px] px-1.5 mr-1">NDC</Badge>
          )}
          <RowSettingsPopover ndc={request.ndc} onNdcChange={handleNdcChange} />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
