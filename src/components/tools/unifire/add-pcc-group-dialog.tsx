import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface AddPccGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (pccIds: string[]) => void
  existingPccs: string[]
}

export function AddPccGroupDialog({
  open,
  onOpenChange,
  onAdd,
  existingPccs,
}: AddPccGroupDialogProps) {
  const [pccIds, setPccIds] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setPccIds([])
      setInputValue('')
      setError(null)
    }
  }, [open])

  const validatePcc = (pcc: string): string | null => {
    if (pcc.length !== 4) {
      return 'PCC must be exactly 4 characters'
    }
    if (!/^[A-Z0-9]+$/.test(pcc)) {
      return 'PCC must be uppercase alphanumeric'
    }
    if (pccIds.includes(pcc)) {
      return 'PCC already added to this group'
    }
    if (existingPccs.includes(pcc)) {
      return 'PCC already exists in another group'
    }
    return null
  }

  const handleAddPcc = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
    if (formatted.length < 4) {
      setError('PCC must be exactly 4 characters')
      return
    }

    const validationError = validatePcc(formatted)
    if (validationError) {
      setError(validationError)
      return
    }

    setPccIds([...pccIds, formatted])
    setInputValue('')
    setError(null)
  }

  const handleRemovePcc = (pcc: string) => {
    setPccIds(pccIds.filter((p) => p !== pcc))
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault()
      if (inputValue) {
        handleAddPcc(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && pccIds.length > 0) {
      setPccIds(pccIds.slice(0, -1))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
    setInputValue(value)
    setError(null)
  }

  const handleSubmit = () => {
    if (pccIds.length === 0) return
    onAdd(pccIds)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add PCC Group</DialogTitle>
          <DialogDescription>
            Create a new PCC group. You can add multiple PCCs that will share the same command
            sequence.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pccs">PCCs *</Label>
            <div
              className={cn(
                'flex flex-wrap gap-2 p-2 min-h-[42px] rounded-md border bg-background',
                error && 'border-destructive'
              )}
            >
              {pccIds.map((pcc) => (
                <span
                  key={pcc}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-sm font-mono"
                >
                  {pcc}
                  <button
                    type="button"
                    onClick={() => handleRemovePcc(pcc)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <Input
                id="pccs"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onBlur={() => {
                  if (inputValue) handleAddPcc(inputValue)
                }}
                placeholder={pccIds.length === 0 ? 'Enter PCC...' : 'Add more...'}
                className="flex-1 min-w-[100px] border-0 p-0 h-7 focus-visible:ring-0 font-mono"
                maxLength={4}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              4 characters, uppercase alphanumeric. Press Enter, Tab, or comma to add.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={pccIds.length === 0}>
            Add Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
