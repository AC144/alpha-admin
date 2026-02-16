import { useState } from 'react'
import { Trash2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { PnrCommandRow } from './pnr-command-row'
import type { PccCommandGroup as PccCommandGroupType, PnrCommand } from '@/types/unifire'

interface PccCommandGroupProps {
  group: PccCommandGroupType
  onUpdate: (group: PccCommandGroupType) => void
  onDelete: () => void
  onAddCommand: (command: PnrCommand) => void
  onUpdateCommand: (commandId: string, command: PnrCommand) => void
  onDeleteCommand: (commandId: string) => void
  onReorderCommand: (commandId: string, direction: 'up' | 'down') => void
}

export function PccCommandGroup({
  group,
  onUpdate,
  onDelete,
  onAddCommand,
  onUpdateCommand,
  onDeleteCommand,
  onReorderCommand,
}: PccCommandGroupProps) {
  const [isEditingPccs, setIsEditingPccs] = useState(false)
  const [pccInput, setPccInput] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteCommandId, setDeleteCommandId] = useState<string | null>(null)

  const handleAddPcc = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
    if (formatted.length === 4 && !group.pccIds.includes(formatted)) {
      onUpdate({
        ...group,
        pccIds: [...group.pccIds, formatted],
      })
    }
    setPccInput('')
  }

  const handleRemovePcc = (pcc: string) => {
    if (group.pccIds.length > 1) {
      onUpdate({
        ...group,
        pccIds: group.pccIds.filter((p) => p !== pcc),
      })
    }
  }

  const handlePccInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault()
      handleAddPcc(pccInput)
    } else if (e.key === 'Backspace' && !pccInput && group.pccIds.length > 1) {
      onUpdate({
        ...group,
        pccIds: group.pccIds.slice(0, -1),
      })
    } else if (e.key === 'Escape') {
      setIsEditingPccs(false)
      setPccInput('')
    }
  }

  const handleAddCommand = () => {
    const newCommand: PnrCommand = {
      id: `cmd-${Date.now()}`,
      command: '',
      hasVariables: false,
      variableTypes: [],
      order: group.commands.length + 1,
    }
    onAddCommand(newCommand)
  }

  const handleConfirmDeleteCommand = () => {
    if (deleteCommandId) {
      onDeleteCommand(deleteCommandId)
      setDeleteCommandId(null)
    }
  }

  const commandToDelete = group.commands.find((c) => c.id === deleteCommandId)

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* PCC Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2 flex-1">
          {isEditingPccs ? (
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {group.pccIds.map((pcc) => (
                <span
                  key={pcc}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-sm font-mono"
                >
                  {pcc}
                  {group.pccIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePcc(pcc)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              <Input
                autoFocus
                value={pccInput}
                onChange={(e) => setPccInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))}
                onKeyDown={handlePccInputKeyDown}
                onBlur={() => {
                  if (pccInput) handleAddPcc(pccInput)
                  setIsEditingPccs(false)
                }}
                placeholder="Add PCC..."
                className="h-7 w-24 font-mono text-sm"
                maxLength={4}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingPccs(true)}
              className="font-medium font-mono text-sm hover:text-primary transition-colors"
            >
              {group.pccIds.join(', ')}
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>

      {/* Commands Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-3 py-2 w-12 text-center font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Command</th>
              <th className="px-3 py-2 w-40 text-left font-medium">Variable</th>
              <th className="px-3 py-2 w-28 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {group.commands.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No commands configured. Click below to add one.
                </td>
              </tr>
            ) : (
              group.commands.map((command, index) => (
                <PnrCommandRow
                  key={command.id}
                  command={command}
                  isFirst={index === 0}
                  isLast={index === group.commands.length - 1}
                  onUpdate={(updatedCommand) => onUpdateCommand(command.id, updatedCommand)}
                  onDelete={() => setDeleteCommandId(command.id)}
                  onMoveUp={() => onReorderCommand(command.id, 'up')}
                  onMoveDown={() => onReorderCommand(command.id, 'down')}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Command Button */}
      <div className="px-4 py-3 border-t bg-muted/20">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={handleAddCommand}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Command
        </Button>
      </div>

      {/* Delete Group Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PCC Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this PCC group ({group.pccIds.join(', ')}) and all its{' '}
              {group.commands.length} command{group.commands.length !== 1 ? 's' : ''}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Command Confirmation */}
      <AlertDialog open={!!deleteCommandId} onOpenChange={(open) => !open && setDeleteCommandId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Command</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this command?
              {commandToDelete && (
                <span className="block mt-2 font-mono text-xs bg-muted px-2 py-1 rounded">
                  {commandToDelete.command}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteCommand}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
