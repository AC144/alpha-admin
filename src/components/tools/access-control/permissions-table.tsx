import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RuleCell } from './rule-cell'
import { RuleEditPanel } from './rule-edit-panel'
import type { PccRuleSet, ContextType, PermissionMode } from './types'
import { contextDescriptions } from './types'

interface PermissionsTableProps {
  ruleSet: PccRuleSet
  onChange: (ruleSet: PccRuleSet) => void
}

type RuleType = 'allowExact' | 'allowStartsWith' | 'denyExact' | 'denyStartsWith'

interface EditingCell {
  contextKey: ContextType
  ruleType: RuleType
}

const contextKeys: ContextType[] = ['any', 'pnr', 'ticketedPnr']

const contextRowLabels: Record<ContextType, string> = {
  any: 'Any',
  pnr: 'PNR',
  ticketedPnr: 'Ticketed PNR',
}

export function PermissionsTable({ ruleSet, onChange }: PermissionsTableProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)

  const updateMode = (contextKey: ContextType, mode: PermissionMode) => {
    onChange({
      ...ruleSet,
      contexts: {
        ...ruleSet.contexts,
        [contextKey]: {
          ...ruleSet.contexts[contextKey],
          mode,
        },
      },
    })
  }

  const updateCommands = (contextKey: ContextType, ruleType: RuleType, commands: string[]) => {
    onChange({
      ...ruleSet,
      contexts: {
        ...ruleSet.contexts,
        [contextKey]: {
          ...ruleSet.contexts[contextKey],
          [ruleType]: commands,
        },
      },
    })
  }

  const getEditingCommands = (): string[] => {
    if (!editingCell) return []
    return ruleSet.contexts[editingCell.contextKey][editingCell.ruleType]
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium w-28">Context</th>
              <th className="px-4 py-3 text-left font-medium w-40">Mode</th>
              <th className="px-3 py-3 text-center font-medium border-l" colSpan={2}>
                <span className="text-green-700">ALLOW</span>
              </th>
              <th className="px-3 py-3 text-center font-medium border-l" colSpan={2}>
                <span className="text-red-700">DENY</span>
              </th>
            </tr>
            <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
              <th></th>
              <th></th>
              <th className="px-3 py-1.5 text-center font-normal border-l">Exact</th>
              <th className="px-3 py-1.5 text-center font-normal">Starts With</th>
              <th className="px-3 py-1.5 text-center font-normal border-l">Exact</th>
              <th className="px-3 py-1.5 text-center font-normal">Starts With</th>
            </tr>
          </thead>
          <tbody>
            {contextKeys.map((contextKey) => {
              const context = ruleSet.contexts[contextKey]
              return (
                <tr key={contextKey} className="border-b last:border-0">
                  {/* Context Label */}
                  <td className="px-4 py-3 align-top">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium cursor-help">
                          {contextRowLabels[contextKey]}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">{contextDescriptions[contextKey]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </td>

                  {/* Mode Toggle */}
                  <td className="px-4 py-3 align-top">
                    <RadioGroup
                      value={context.mode}
                      onValueChange={(value: PermissionMode) => updateMode(contextKey, value)}
                      className="space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="allow-listed"
                          id={`${ruleSet.id}-${contextKey}-allow-listed`}
                          className="h-3.5 w-3.5"
                        />
                        <Label
                          htmlFor={`${ruleSet.id}-${contextKey}-allow-listed`}
                          className={cn(
                            'cursor-pointer text-xs',
                            context.mode === 'allow-listed' ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          Allow-listed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="allow-all-except"
                          id={`${ruleSet.id}-${contextKey}-allow-all`}
                          className="h-3.5 w-3.5"
                        />
                        <Label
                          htmlFor={`${ruleSet.id}-${contextKey}-allow-all`}
                          className={cn(
                            'cursor-pointer text-xs',
                            context.mode === 'allow-all-except' ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          Allow all except
                        </Label>
                      </div>
                    </RadioGroup>
                  </td>

                  {/* Allow Exact */}
                  <td className="px-2 py-2 border-l">
                    <RuleCell
                      commands={context.allowExact}
                      variant="allow"
                      onClick={() => setEditingCell({ contextKey, ruleType: 'allowExact' })}
                    />
                  </td>

                  {/* Allow Starts With */}
                  <td className="px-2 py-2">
                    <RuleCell
                      commands={context.allowStartsWith}
                      variant="allow"
                      onClick={() => setEditingCell({ contextKey, ruleType: 'allowStartsWith' })}
                    />
                  </td>

                  {/* Deny Exact */}
                  <td className="px-2 py-2 border-l">
                    <RuleCell
                      commands={context.denyExact}
                      variant="deny"
                      onClick={() => setEditingCell({ contextKey, ruleType: 'denyExact' })}
                    />
                  </td>

                  {/* Deny Starts With */}
                  <td className="px-2 py-2">
                    <RuleCell
                      commands={context.denyStartsWith}
                      variant="deny"
                      onClick={() => setEditingCell({ contextKey, ruleType: 'denyStartsWith' })}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Panel */}
      {editingCell && (
        <RuleEditPanel
          open={!!editingCell}
          onOpenChange={(open) => !open && setEditingCell(null)}
          contextKey={editingCell.contextKey}
          ruleType={editingCell.ruleType}
          commands={getEditingCommands()}
          onSave={(commands) => {
            updateCommands(editingCell.contextKey, editingCell.ruleType, commands)
            setEditingCell(null)
          }}
        />
      )}
    </TooltipProvider>
  )
}
