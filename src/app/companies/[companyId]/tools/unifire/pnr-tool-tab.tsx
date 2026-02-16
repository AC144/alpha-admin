import { useState } from 'react'
import { Plus, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PccCommandGroup } from '@/components/tools/unifire/pcc-command-group'
import { AddPccGroupDialog } from '@/components/tools/unifire/add-pcc-group-dialog'
import type { PnrToolConfig, PccCommandGroup as PccCommandGroupType, PnrCommand } from '@/types/unifire'
import { VariableType, VARIABLE_TYPE_INFO } from '@/types/unifire'

// Mock data
const mockPnrToolConfig: PnrToolConfig = {
  pccGroups: [
    {
      id: 'grp-1',
      pccIds: ['U9XF'],
      commands: [
        { id: 'cmd-1', command: 'DK0010020012', hasVariables: false, variableTypes: [], order: 1 },
        { id: 'cmd-2', command: '7TAW/ETKT', hasVariables: false, variableTypes: [], order: 2 },
        { id: 'cmd-3', command: 'PE¥INFO@VIPFARES.COM¥', hasVariables: false, variableTypes: [], order: 3 },
        { id: 'cmd-4', command: '9855-777-5533', hasVariables: false, variableTypes: [], order: 4 },
        { id: 'cmd-5', command: 'W-VIP FARES¥16192 COASTAL HIGHWAY ¥LEWES DE 19958¥US', hasVariables: false, variableTypes: [], order: 5 },
        { id: 'cmd-6', command: '5M¥TASF1-0.00', hasVariables: false, variableTypes: [], order: 6 },
        { id: 'cmd-7', command: '5.S*ICBTM', hasVariables: false, variableTypes: [], order: 7 },
        { id: 'cmd-8', command: '5.S*HU', hasVariables: false, variableTypes: [], order: 8 },
        { id: 'cmd-9', command: '5.S*SA7M', hasVariables: false, variableTypes: [], order: 9 },
        { id: 'cmd-10', command: '0OTHYYGK1MIA<>-KEEP PNR ACTIVE', hasVariables: true, variableTypes: [VariableType.Date1], order: 10 },
        { id: 'cmd-11', command: '6<>', hasVariables: true, variableTypes: [VariableType.Agent], order: 11 },
        { id: 'cmd-12', command: 'ER', hasVariables: false, variableTypes: [], order: 12 },
        { id: 'cmd-13', command: 'ER', hasVariables: false, variableTypes: [], order: 13 },
      ],
    },
    {
      id: 'grp-2',
      pccIds: ['UE07', 'KH6G', '2GAC'],
      commands: [
        { id: 'cmd-20', command: 'DK370042', hasVariables: false, variableTypes: [], order: 1 },
        { id: 'cmd-21', command: '7TAW/', hasVariables: false, variableTypes: [], order: 2 },
        { id: 'cmd-22', command: 'PE¥INFO@VIPFARES.COM¥', hasVariables: false, variableTypes: [], order: 3 },
        { id: 'cmd-23', command: '9855-777-5533', hasVariables: false, variableTypes: [], order: 4 },
        { id: 'cmd-24', command: 'W-VIP FARES¥16192 COASTAL HIGHWAY ¥LEWES DE 19958¥US', hasVariables: false, variableTypes: [], order: 5 },
        { id: 'cmd-25', command: '5h-VIP', hasVariables: false, variableTypes: [], order: 6 },
        { id: 'cmd-26', command: '0OTHYYGK1MIA<>-KEEP PNR ACTIVE', hasVariables: true, variableTypes: [VariableType.Date1], order: 7 },
        { id: 'cmd-27', command: '6<>', hasVariables: true, variableTypes: [VariableType.Agent], order: 8 },
        { id: 'cmd-28', command: 'ER', hasVariables: false, variableTypes: [], order: 9 },
        { id: 'cmd-29', command: 'ER', hasVariables: false, variableTypes: [], order: 10 },
      ],
    },
  ],
}

interface PnrToolTabProps {
  companyId: string
}

export function PnrToolTab({ companyId: _companyId }: PnrToolTabProps) {
  const [config, setConfig] = useState<PnrToolConfig>(mockPnrToolConfig)
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false)

  const handleUpdateGroup = (groupId: string, updatedGroup: PccCommandGroupType) => {
    setConfig({
      ...config,
      pccGroups: config.pccGroups.map((g) => (g.id === groupId ? updatedGroup : g)),
    })
  }

  const handleDeleteGroup = (groupId: string) => {
    setConfig({
      ...config,
      pccGroups: config.pccGroups.filter((g) => g.id !== groupId),
    })
  }

  const handleAddGroup = (pccIds: string[]) => {
    const newGroup: PccCommandGroupType = {
      id: `grp-${Date.now()}`,
      pccIds,
      commands: [],
    }
    setConfig({
      ...config,
      pccGroups: [...config.pccGroups, newGroup],
    })
  }

  const handleAddCommand = (groupId: string, command: PnrCommand) => {
    setConfig({
      ...config,
      pccGroups: config.pccGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            commands: [...g.commands, command],
          }
        }
        return g
      }),
    })
  }

  const handleUpdateCommand = (groupId: string, commandId: string, updatedCommand: PnrCommand) => {
    setConfig({
      ...config,
      pccGroups: config.pccGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            commands: g.commands.map((c) => (c.id === commandId ? updatedCommand : c)),
          }
        }
        return g
      }),
    })
  }

  const handleDeleteCommand = (groupId: string, commandId: string) => {
    setConfig({
      ...config,
      pccGroups: config.pccGroups.map((g) => {
        if (g.id === groupId) {
          const filteredCommands = g.commands.filter((c) => c.id !== commandId)
          // Renumber orders
          return {
            ...g,
            commands: filteredCommands.map((c, idx) => ({ ...c, order: idx + 1 })),
          }
        }
        return g
      }),
    })
  }

  const handleReorderCommand = (groupId: string, commandId: string, direction: 'up' | 'down') => {
    setConfig({
      ...config,
      pccGroups: config.pccGroups.map((g) => {
        if (g.id === groupId) {
          const commands = [...g.commands]
          const index = commands.findIndex((c) => c.id === commandId)
          if (index === -1) return g
          if (direction === 'up' && index === 0) return g
          if (direction === 'down' && index === commands.length - 1) return g

          const targetIndex = direction === 'up' ? index - 1 : index + 1
          ;[commands[index], commands[targetIndex]] = [commands[targetIndex], commands[index]]

          // Renumber orders
          return {
            ...g,
            commands: commands.map((c, idx) => ({ ...c, order: idx + 1 })),
          }
        }
        return g
      }),
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>PNR Tool Configuration</CardTitle>
              <CardDescription>
                Configure PNR command sequences per PCC. Commands run in order.
                Use {'<>'} as placeholder for variables that auto-fill at runtime.
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-sm">
                  <div className="space-y-2">
                    <p className="font-medium">Variable Types</p>
                    <div className="text-xs space-y-1.5">
                      {Object.entries(VARIABLE_TYPE_INFO).map(([_, info]) => (
                        <div key={info.label}>
                          <span className="font-medium">{info.label}</span>: {info.description}
                          <br />
                          <span className="text-muted-foreground">{info.example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {config.pccGroups.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No PCC groups configured. Click below to add one.
            </div>
          ) : (
            config.pccGroups.map((group) => (
              <PccCommandGroup
                key={group.id}
                group={group}
                onUpdate={(updatedGroup) => handleUpdateGroup(group.id, updatedGroup)}
                onDelete={() => handleDeleteGroup(group.id)}
                onAddCommand={(command) => handleAddCommand(group.id, command)}
                onUpdateCommand={(commandId, updatedCommand) =>
                  handleUpdateCommand(group.id, commandId, updatedCommand)
                }
                onDeleteCommand={(commandId) => handleDeleteCommand(group.id, commandId)}
                onReorderCommand={(commandId, direction) =>
                  handleReorderCommand(group.id, commandId, direction)
                }
              />
            ))
          )}

          <Button variant="outline" className="w-full" onClick={() => setIsAddGroupOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add PCC Group
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>

      <AddPccGroupDialog
        open={isAddGroupOpen}
        onOpenChange={setIsAddGroupOpen}
        onAdd={handleAddGroup}
        existingPccs={config.pccGroups.flatMap((g) => g.pccIds)}
      />
    </div>
  )
}
