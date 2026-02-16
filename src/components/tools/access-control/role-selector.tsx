import { Plus, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Role } from './types'

interface RoleSelectorProps {
  roles: Role[]
  selectedRoleId: string | null
  onSelectRole: (roleId: string) => void
  onNewRole: () => void
  onDuplicateRole: () => void
  onDeleteRole: () => void
  hasUnsavedChanges?: boolean
}

export function RoleSelector({
  roles,
  selectedRoleId,
  onSelectRole,
  onNewRole,
  onDuplicateRole,
  onDeleteRole,
  hasUnsavedChanges,
}: RoleSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Role:</span>
        <Select value={selectedRoleId || ''} onValueChange={onSelectRole}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onNewRole}>
          <Plus className="h-4 w-4 mr-1" />
          New Role
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicateRole}
          disabled={!selectedRoleId}
        >
          <Copy className="h-4 w-4 mr-1" />
          Duplicate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteRole}
          disabled={!selectedRoleId}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      {hasUnsavedChanges && (
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          Unsaved changes
        </span>
      )}
    </div>
  )
}
