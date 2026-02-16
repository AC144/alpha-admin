import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Trash2, Globe, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PermissionsTable } from './permissions-table'
import type { PccRuleSet } from './types'
import { isValidPcc } from './types'

interface PccRuleSetCardProps {
  ruleSet: PccRuleSet
  onChange: (ruleSet: PccRuleSet) => void
  onDuplicate: () => void
  onDelete: () => void
  canDelete: boolean
}

interface PccChipInputProps {
  pccs: string[]
  onChange: (pccs: string[]) => void
}

function PccChipInput({ pccs, onChange }: PccChipInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)

  const isAllPccs = pccs.length === 1 && pccs[0] === '*'

  const addPcc = (value: string) => {
    const pcc = value.toUpperCase().replace(/[^A-Z0-9*]/g, '').slice(0, 4)
    if (!pcc) {
      setInputValue('')
      return
    }

    // Validate
    if (!isValidPcc(pcc)) {
      setError(true)
      setTimeout(() => setError(false), 500)
      return
    }

    // Handle wildcard
    if (pcc === '*') {
      onChange(['*'])
      setInputValue('')
      return
    }

    // Don't add if already exists or if wildcard is set
    if (pccs.includes(pcc) || isAllPccs) {
      setError(true)
      setTimeout(() => setError(false), 500)
      return
    }

    onChange([...pccs, pcc])
    setInputValue('')
  }

  const removePcc = (pcc: string) => {
    const newPccs = pccs.filter((p) => p !== pcc)
    // If removing last PCC, default to wildcard
    onChange(newPccs.length === 0 ? ['*'] : newPccs)
  }

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 p-2 min-h-[38px] rounded-md border bg-background transition-colors',
        error ? 'border-destructive' : 'border-input'
      )}
    >
      {isAllPccs ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800">
          <Globe className="h-3 w-3" />
          All PCCs
          <button
            type="button"
            onClick={() => onChange([])}
            className="hover:text-blue-600"
            title="Click to specify PCCs"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ) : (
        <>
          {pccs.map((pcc) => (
            <span
              key={pcc}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-mono bg-primary/10 text-primary"
            >
              {pcc}
              <button
                type="button"
                onClick={() => removePcc(pcc)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </>
      )}
      {!isAllPccs && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase().replace(/[^A-Z0-9*]/g, '').slice(0, 4))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
              e.preventDefault()
              addPcc(inputValue)
            } else if (e.key === 'Backspace' && !inputValue && pccs.length > 0) {
              removePcc(pccs[pccs.length - 1])
            }
          }}
          onBlur={() => inputValue && addPcc(inputValue)}
          placeholder={pccs.length === 0 ? "Enter PCC or * for all" : "Add PCC..."}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm font-mono"
          maxLength={4}
        />
      )}
    </div>
  )
}

export function PccRuleSetCard({ ruleSet, onChange, onDuplicate, onDelete, canDelete }: PccRuleSetCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isAllPccs = ruleSet.pccs.length === 1 && ruleSet.pccs[0] === '*'
  const pccLabel = isAllPccs
    ? 'All PCCs (Default)'
    : ruleSet.pccs.length === 1
      ? ruleSet.pccs[0]
      : `${ruleSet.pccs.slice(0, 3).join(', ')}${ruleSet.pccs.length > 3 ? ` +${ruleSet.pccs.length - 3}` : ''}`

  const handlePccChange = (pccs: string[]) => {
    onChange({
      ...ruleSet,
      pccs: pccs.length === 0 ? ['*'] : pccs,
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-muted rounded"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>

          <div className="flex-1">
            <div className="text-sm font-medium mb-1">
              PCC Rule Set: <span className="text-primary">{pccLabel}</span>
            </div>
            {!isCollapsed && (
              <PccChipInput pccs={ruleSet.pccs} onChange={handlePccChange} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="text-muted-foreground hover:text-foreground"
            title="Duplicate rule set"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={!canDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Delete rule set"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          <PermissionsTable ruleSet={ruleSet} onChange={onChange} />
        </div>
      )}
    </div>
  )
}
