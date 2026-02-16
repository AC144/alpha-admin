import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LimitsGrid, type LimitValue, type LimitRowConfig } from '@/components/tools/limits-grid'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  type Role,
  type PccRuleSet,
  createEmptyContextRules,
  createEmptyPccRuleSet,
  RoleSelector,
} from '@/components/tools/access-control'
import { PccRuleSetCard } from '@/components/tools/access-control/pcc-rule-set-card'
import { DEFAULT_MAX_SESSIONS_PER_USER, DEFAULT_MAX_SESSIONS_PER_COMPANY } from '@/lib/constants'

interface AccessControlTabProps {
  companyId: string
}

// Default roles data with new PCC Rule Set structure
const defaultRoles: Role[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'View-only commands, no modifications',
    pccRuleSets: [
      {
        id: '1-default',
        pccs: ['*'],
        contexts: {
          any: {
            mode: 'allow-listed',
            allowExact: ['*R', '*S', 'I', 'IG'],
            allowStartsWith: ['0', '1'],
            denyExact: [],
            denyStartsWith: [],
          },
          pnr: createEmptyContextRules(),
          ticketedPnr: createEmptyContextRules(),
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Advanced',
    description: 'Standard booking and pricing commands',
    pccRuleSets: [
      {
        id: '2-default',
        pccs: ['*'],
        contexts: {
          any: {
            mode: 'allow-listed',
            allowExact: ['*R', '*S', 'VI*', '*IA', '*H', '*HIA', '*HI', 'I', 'IG', 'IR', 'VCT*', 'MD', 'MU', 'MT', 'MB', '*I'],
            allowStartsWith: ['0', '1', 'X', ',', 'WC', 'WP', 'FQ', 'RD', 'RB', 'W/*', 'T*', 'JR', '/', '4G'],
            denyExact: [],
            denyStartsWith: [],
          },
          pnr: {
            mode: 'allow-listed',
            allowExact: ['N', 'NB'],
            allowStartsWith: ['4', '5', '6'],
            denyExact: ['E', 'ER'],
            denyStartsWith: ['W-'],
          },
          ticketedPnr: createEmptyContextRules(),
        },
      },
    ],
  },
  {
    id: '3',
    name: 'Expert',
    description: 'Extended commands including ticketing and queue management',
    pccRuleSets: [
      {
        id: '3-default',
        pccs: ['*'],
        contexts: {
          any: {
            mode: 'allow-listed',
            allowExact: ['*R', '*S', 'VI*', '*IA', '*H', '*HIA', '*HI', 'I', 'IG', 'IR', 'VCT*', 'MD', 'MU', 'MT', 'MB', '*I', 'QC', 'QXI', 'QS'],
            allowStartsWith: ['0', '1', 'X', ',', 'WC', 'WP', 'FQ', 'RD', 'RB', 'W/*', 'T*', 'JR', '/', '4G', 'Q'],
            denyExact: [],
            denyStartsWith: [],
          },
          pnr: createEmptyContextRules(),
          ticketedPnr: createEmptyContextRules(),
        },
      },
    ],
  },
  {
    id: '4',
    name: 'Unlim',
    description: 'Full unrestricted access to all commands',
    pccRuleSets: [
      {
        id: '4-default',
        pccs: ['*'],
        contexts: {
          any: createEmptyContextRules('allow-all-except'),
          pnr: createEmptyContextRules('allow-all-except'),
          ticketedPnr: createEmptyContextRules('allow-all-except'),
        },
      },
    ],
  },
]

const sessionLimitRows: LimitRowConfig[] = [
  { key: 'maxSessions', label: 'Max Sessions' },
]

const mockSessionLimits: Record<string, LimitValue> = {
  maxSessions: { perUser: DEFAULT_MAX_SESSIONS_PER_USER, perCompany: DEFAULT_MAX_SESSIONS_PER_COMPANY },
}

export function AccessControlTab({ companyId: _companyId }: AccessControlTabProps) {
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(defaultRoles[0]?.id || null)
  const [editedRole, setEditedRole] = useState<Role | null>(null)
  const [originalRole, setOriginalRole] = useState<Role | null>(null)
  const [sessionLimits, setSessionLimits] = useState<Record<string, LimitValue>>(mockSessionLimits)

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null)

  // Load role when selection changes
  useEffect(() => {
    if (selectedRoleId) {
      const role = roles.find((r) => r.id === selectedRoleId)
      if (role) {
        setEditedRole(JSON.parse(JSON.stringify(role)))
        setOriginalRole(JSON.parse(JSON.stringify(role)))
      }
    }
  }, [selectedRoleId, roles])

  const hasUnsavedChanges = editedRole && originalRole
    ? JSON.stringify(editedRole) !== JSON.stringify(originalRole)
    : false

  const handleSelectRole = (roleId: string) => {
    if (hasUnsavedChanges) {
      setPendingRoleId(roleId)
      setUnsavedDialogOpen(true)
    } else {
      setSelectedRoleId(roleId)
    }
  }

  const handleDiscardAndSwitch = () => {
    setUnsavedDialogOpen(false)
    if (pendingRoleId) {
      setSelectedRoleId(pendingRoleId)
      setPendingRoleId(null)
    }
  }

  const handleNewRole = () => {
    setNewRoleName('')
    setNewRoleDescription('')
    setNewRoleDialogOpen(true)
  }

  const handleCreateRole = () => {
    const newRole: Role = {
      id: String(Date.now()),
      name: newRoleName.trim(),
      description: newRoleDescription.trim(),
      pccRuleSets: [createEmptyPccRuleSet()],
    }
    setRoles([...roles, newRole])
    setSelectedRoleId(newRole.id)
    setNewRoleDialogOpen(false)
  }

  const handleDuplicateRole = () => {
    if (!editedRole) return
    const duplicatedRole: Role = {
      ...JSON.parse(JSON.stringify(editedRole)),
      id: String(Date.now()),
      name: `Copy of ${editedRole.name}`,
      pccRuleSets: editedRole.pccRuleSets.map((rs, i) => ({
        ...JSON.parse(JSON.stringify(rs)),
        id: `${Date.now()}-${i}`,
      })),
    }
    setRoles([...roles, duplicatedRole])
    setSelectedRoleId(duplicatedRole.id)
  }

  const handleDeleteRole = () => {
    if (!selectedRoleId) return
    const newRoles = roles.filter((r) => r.id !== selectedRoleId)
    setRoles(newRoles)
    setSelectedRoleId(newRoles[0]?.id || null)
    setDeleteDialogOpen(false)
  }

  const handleRoleChange = (updatedRole: Role) => {
    setEditedRole(updatedRole)
  }

  const handleRuleSetChange = (index: number, updatedRuleSet: PccRuleSet) => {
    if (!editedRole) return
    const newRuleSets = [...editedRole.pccRuleSets]
    newRuleSets[index] = updatedRuleSet
    handleRoleChange({ ...editedRole, pccRuleSets: newRuleSets })
  }

  const handleAddRuleSet = () => {
    if (!editedRole) return
    handleRoleChange({
      ...editedRole,
      pccRuleSets: [...editedRole.pccRuleSets, createEmptyPccRuleSet([])],
    })
  }

  const handleDuplicateRuleSet = (index: number) => {
    if (!editedRole) return
    const ruleSetToDuplicate = editedRole.pccRuleSets[index]
    const duplicatedRuleSet: PccRuleSet = {
      ...JSON.parse(JSON.stringify(ruleSetToDuplicate)),
      id: String(Date.now()),
      pccs: ruleSetToDuplicate.pccs[0] === '*' ? [] : [...ruleSetToDuplicate.pccs],
    }
    const newRuleSets = [...editedRole.pccRuleSets]
    newRuleSets.splice(index + 1, 0, duplicatedRuleSet)
    handleRoleChange({ ...editedRole, pccRuleSets: newRuleSets })
  }

  const handleDeleteRuleSet = (index: number) => {
    if (!editedRole || editedRole.pccRuleSets.length <= 1) return
    const newRuleSets = editedRole.pccRuleSets.filter((_, i) => i !== index)
    handleRoleChange({ ...editedRole, pccRuleSets: newRuleSets })
  }

  const handleSave = () => {
    if (!editedRole) return
    setRoles(roles.map((r) => (r.id === editedRole.id ? editedRole : r)))
    setOriginalRole(JSON.parse(JSON.stringify(editedRole)))
  }

  const selectedRole = editedRole

  return (
    <div className="space-y-6">
      {/* Session Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Session Limits</CardTitle>
          <CardDescription>
            Set the maximum number of concurrent sessions allowed per user and per company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LimitsGrid
            rows={sessionLimitRows}
            values={sessionLimits}
            onChange={setSessionLimits}
          />
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>
            Configure command permissions per role. Each role contains PCC Rule Sets that define permissions for specific PCCs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selector */}
          <RoleSelector
            roles={roles}
            selectedRoleId={selectedRoleId}
            onSelectRole={handleSelectRole}
            onNewRole={handleNewRole}
            onDuplicateRole={handleDuplicateRole}
            onDeleteRole={() => setDeleteDialogOpen(true)}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          {/* Role Details */}
          {selectedRole && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Name</Label>
                  <Input
                    id="role-name"
                    value={selectedRole.name}
                    onChange={(e) =>
                      handleRoleChange({ ...selectedRole, name: e.target.value })
                    }
                    placeholder="Role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-description">Description</Label>
                  <Input
                    id="role-description"
                    value={selectedRole.description}
                    onChange={(e) =>
                      handleRoleChange({ ...selectedRole, description: e.target.value })
                    }
                    placeholder="Role description"
                  />
                </div>
              </div>

              {/* PCC Rule Sets */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">PCC Rule Sets</h3>
                  <Button variant="outline" size="sm" onClick={handleAddRuleSet}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule Set
                  </Button>
                </div>

                {selectedRole.pccRuleSets.map((ruleSet, index) => (
                  <PccRuleSetCard
                    key={ruleSet.id}
                    ruleSet={ruleSet}
                    onChange={(updated) => handleRuleSetChange(index, updated)}
                    onDuplicate={() => handleDuplicateRuleSet(index)}
                    onDelete={() => handleDeleteRuleSet(index)}
                    canDelete={selectedRole.pccRuleSets.length > 1}
                  />
                ))}
              </div>
            </>
          )}

          {!selectedRole && (
            <div className="text-center py-12 text-muted-foreground">
              Select a role or create a new one to configure permissions.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
          Save Changes
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Role Dialog */}
      <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Enter a name and description for the new role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Name *</Label>
              <Input
                id="new-role-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="e.g., Manager"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role-description">Description</Label>
              <Input
                id="new-role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="e.g., Access to booking and pricing commands"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to discard them and switch to another role?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingRoleId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardAndSwitch}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
