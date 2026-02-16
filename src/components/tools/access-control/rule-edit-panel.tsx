import { useState, useEffect } from 'react'
import { X, Check, Ban } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ContextType } from './types'
import { contextLabels } from './types'

interface RuleEditPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contextKey: ContextType
  ruleType: 'allowExact' | 'allowStartsWith' | 'denyExact' | 'denyStartsWith'
  commands: string[]
  onSave: (commands: string[]) => void
}

const ruleTypeLabels: Record<string, { label: string; description: string }> = {
  allowExact: { label: 'Allow Exact', description: 'Commands that must match exactly to allow' },
  allowStartsWith: { label: 'Allow Starts With', description: 'Command prefixes to allow' },
  denyExact: { label: 'Deny Exact', description: 'Commands that must match exactly to deny' },
  denyStartsWith: { label: 'Deny Starts With', description: 'Command prefixes to deny' },
}

interface ChipInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  transform?: (value: string) => string
  chipClassName?: string
}

function ChipInput({
  value,
  onChange,
  placeholder,
  transform,
  chipClassName,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)

  const addItem = (item: string) => {
    const transformed = transform ? transform(item) : item.trim()
    if (!transformed) {
      setInputValue('')
      return
    }
    if (value.includes(transformed)) {
      setError(true)
      setTimeout(() => setError(false), 500)
      return
    }
    onChange([...value, transformed])
    setInputValue('')
  }

  const removeItem = (item: string) => {
    onChange(value.filter((v) => v !== item))
  }

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 p-2 min-h-[42px] rounded-md border bg-background transition-colors',
        error ? 'border-destructive' : 'border-input'
      )}
    >
      {value.map((item) => (
        <span
          key={item}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-mono',
            chipClassName
          )}
        >
          {item}
          <button
            type="button"
            onClick={() => removeItem(item)}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const val = transform ? transform(e.target.value) : e.target.value
          setInputValue(val)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
            e.preventDefault()
            addItem(inputValue)
          } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeItem(value[value.length - 1])
          }
        }}
        onBlur={() => inputValue && addItem(inputValue)}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] bg-transparent outline-none text-sm font-mono"
      />
    </div>
  )
}

export function RuleEditPanel({
  open,
  onOpenChange,
  contextKey,
  ruleType,
  commands: initialCommands,
  onSave,
}: RuleEditPanelProps) {
  const [commands, setCommands] = useState<string[]>(initialCommands)

  const isAllow = ruleType.startsWith('allow')
  const typeInfo = ruleTypeLabels[ruleType]

  // Reset state when panel opens
  useEffect(() => {
    if (open) {
      setCommands(initialCommands)
    }
  }, [open, initialCommands])

  const handleSave = () => {
    onSave(commands)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {isAllow ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Ban className="h-4 w-4 text-red-600" />
            )}
            {contextLabels[contextKey]} - {typeInfo.label}
          </SheetTitle>
          <SheetDescription>{typeInfo.description}</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Commands */}
          <div className="space-y-2">
            <Label>Commands</Label>
            <ChipInput
              value={commands}
              onChange={setCommands}
              placeholder="Type command and press Enter (e.g., *R, WC)"
              transform={(v) => v.toUpperCase()}
              chipClassName={isAllow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            />
            <p className="text-xs text-muted-foreground">
              Enter Sabre commands. Press Enter or comma to add.
            </p>
          </div>

          {/* Preview */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground w-20 shrink-0">Commands:</span>
                <span className="font-mono">
                  {commands.length === 0 ? (
                    <span className="text-muted-foreground">None</span>
                  ) : (
                    commands.join(', ')
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
