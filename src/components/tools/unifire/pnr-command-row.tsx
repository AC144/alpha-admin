import { useState, Fragment, useEffect } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { PnrCommand } from '@/types/unifire'
import { VariableType, VARIABLE_TYPE_INFO } from '@/types/unifire'

interface PnrCommandRowProps {
  command: PnrCommand
  isFirst: boolean
  isLast: boolean
  onUpdate: (command: PnrCommand) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

// Highlight <> placeholders in red
function HighlightedCommand({ text }: { text: string }) {
  const parts = text.split(/(<>)/g)
  return (
    <span className="font-mono text-sm">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part === '<>' ? (
            <span className="text-red-500 font-bold">{part}</span>
          ) : (
            part
          )}
        </Fragment>
      ))}
    </span>
  )
}

export function PnrCommandRow({
  command,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: PnrCommandRowProps) {
  // Start in edit mode if command is empty (newly added)
  const [isEditing, setIsEditing] = useState(!command.command)
  const [editCommand, setEditCommand] = useState(command.command)
  const [editVariableTypes, setEditVariableTypes] = useState<VariableType[]>(command.variableTypes)

  // Update edit state when command prop changes (for newly added rows)
  useEffect(() => {
    if (!command.command) {
      setIsEditing(true)
    }
  }, [command.command])

  const hasPlaceholder = editCommand.includes('<>')

  const handleSave = () => {
    const hasVariables = editCommand.includes('<>')
    onUpdate({
      ...command,
      command: editCommand,
      hasVariables,
      variableTypes: hasVariables ? editVariableTypes : [],
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    // If command was empty (newly added), delete it on cancel
    if (!command.command) {
      onDelete()
      return
    }
    setEditCommand(command.command)
    setEditVariableTypes(command.variableTypes)
    setIsEditing(false)
  }

  const handleToggleVariableType = (type: VariableType) => {
    if (editVariableTypes.includes(type)) {
      setEditVariableTypes(editVariableTypes.filter((t) => t !== type))
    } else {
      setEditVariableTypes([...editVariableTypes, type])
    }
  }

  if (isEditing) {
    return (
      <tr className="border-b last:border-0 bg-muted/20">
        <td className="px-3 py-2 text-center">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
            {command.order}
          </span>
        </td>
        <td className="px-3 py-2">
          <Input
            autoFocus
            value={editCommand}
            onChange={(e) => setEditCommand(e.target.value)}
            className="font-mono text-sm h-8"
            placeholder="Enter command..."
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel()
              } else if (e.key === 'Enter' && editCommand.trim() && (!hasPlaceholder || editVariableTypes.length > 0)) {
                handleSave()
              }
            }}
          />
          {hasPlaceholder && (
            <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 mb-2">
                Detected placeholder: <span className="font-mono font-bold text-red-500">{'<>'}</span>
              </p>
              <div className="space-y-1.5">
                {Object.entries(VARIABLE_TYPE_INFO).map(([typeKey, info]) => {
                  const type = Number(typeKey) as VariableType
                  return (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={editVariableTypes.includes(type)}
                        onCheckedChange={() => handleToggleVariableType(type)}
                      />
                      <span className="text-xs">
                        <span className="font-medium">{info.label}</span> - {info.description}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </td>
        <td className="px-3 py-2">
          {hasPlaceholder && editVariableTypes.length > 0 ? (
            <div className="flex flex-col gap-1">
              {editVariableTypes.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs whitespace-nowrap">
                  {VARIABLE_TYPE_INFO[type].description}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSave}
              disabled={!editCommand.trim() || (hasPlaceholder && editVariableTypes.length === 0)}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30">
      <td className="px-3 py-2 text-center">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
          {command.order}
        </span>
      </td>
      <td className="px-3 py-2">
        <HighlightedCommand text={command.command} />
      </td>
      <td className="px-3 py-2">
        {command.hasVariables && command.variableTypes.length > 0 ? (
          <div className="flex flex-col gap-1">
            {command.variableTypes.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs whitespace-nowrap">
                {VARIABLE_TYPE_INFO[type].description}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center justify-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <span className="text-xs">▲</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <span className="text-xs">▼</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
