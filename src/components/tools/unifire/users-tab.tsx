import { useState, useMemo } from 'react'
import { Plus, Settings, MoreHorizontal, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserConfigPanel, type CompanyDefaults } from './user-config-panel'
import { cn } from '@/lib/utils'

// ---------- Types ----------

export interface UnifireUser {
  id: string
  email: string
  username: string
  status: 'active' | 'invited' | 'inactive'
  roleOverride: string | null
  sessionLimitOverride: number | null
  searchLimitsOverride: {
    basic: number | null
    withFlex: number | null
    alternateCity: number | null
    perJourney: number | null
  } | null
  lastActive: string | null
  createdAt: string
  createdBy: string
}

export interface RoleOption {
  id: string
  name: string
}

// ---------- Mock Data ----------

const roles: RoleOption[] = [
  { id: '1', name: 'Basic' },
  { id: '2', name: 'Advanced' },
  { id: '3', name: 'Expert' },
  { id: '4', name: 'Unlimited' },
]

const companyDefaults: CompanyDefaults = {
  defaultRoleId: '2',
  defaultRoleName: 'Advanced',
  sessionLimit: 3,
  searchLimits: {
    basic: 40,
    withFlex: 40,
    alternateCity: 30,
    perJourney: 20,
  },
}

const mockUsers: UnifireUser[] = [
  {
    id: '1',
    email: 'alice@travelpelicans.com',
    username: 'Alice Johnson',
    status: 'active',
    roleOverride: null,
    sessionLimitOverride: null,
    searchLimitsOverride: null,
    lastActive: '2026-02-05T14:32:05Z',
    createdAt: '2025-11-15T09:00:00Z',
    createdBy: 'admin@travelpelicans.com',
  },
  {
    id: '2',
    email: 'maria@travelpelicans.com',
    username: 'Maria Rodriguez',
    status: 'active',
    roleOverride: '3',
    sessionLimitOverride: 5,
    searchLimitsOverride: {
      basic: 50,
      withFlex: 50,
      alternateCity: null,
      perJourney: null,
    },
    lastActive: '2026-02-04T16:45:00Z',
    createdAt: '2025-10-20T11:30:00Z',
    createdBy: 'admin@travelpelicans.com',
  },
  {
    id: '3',
    email: 'john@travelpelicans.com',
    username: 'John Davis',
    status: 'invited',
    roleOverride: null,
    sessionLimitOverride: null,
    searchLimitsOverride: null,
    lastActive: null,
    createdAt: '2026-01-28T14:00:00Z',
    createdBy: 'admin@travelpelicans.com',
  },
  {
    id: '4',
    email: 'nina@travelpelicans.com',
    username: 'Nina Kim',
    status: 'inactive',
    roleOverride: null,
    sessionLimitOverride: null,
    searchLimitsOverride: null,
    lastActive: '2026-01-15T10:20:00Z',
    createdAt: '2025-09-01T08:00:00Z',
    createdBy: 'admin@travelpelicans.com',
  },
]

// ---------- Helpers ----------

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function hasOverrides(user: UnifireUser): boolean {
  if (user.roleOverride !== null) return true
  if (user.sessionLimitOverride !== null) return true
  if (user.searchLimitsOverride) {
    const sl = user.searchLimitsOverride
    if (sl.basic !== null || sl.withFlex !== null || sl.alternateCity !== null || sl.perJourney !== null) return true
  }
  return false
}

function getEffectiveRoleName(user: UnifireUser): string {
  if (user.roleOverride) {
    const role = roles.find((r) => r.id === user.roleOverride)
    return role?.name || 'Unknown'
  }
  return companyDefaults.defaultRoleName
}


// ---------- Status Badge ----------

function StatusBadge({ status }: { status: UnifireUser['status'] }) {
  const config = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
    invited: { label: 'Invited', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    inactive: { label: 'Inactive', className: 'bg-red-100 text-red-800 border-red-200' },
  }
  const c = config[status]
  return <Badge variant="outline" className={cn('text-xs', c.className)}>{c.label}</Badge>
}

// ---------- Invite User Modal ----------

function InviteUserModal({
  open,
  onOpenChange,
  onInvite,
  existingEmails,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (data: { email: string; username: string; roleOverride: string | null }) => void
  existingEmails: string[]
}) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [roleSelection, setRoleSelection] = useState('default')
  const [emailError, setEmailError] = useState('')

  const handleSave = () => {
    if (!email.trim() || !username.trim()) return
    if (existingEmails.includes(email.trim().toLowerCase())) {
      setEmailError('A user with this email already exists')
      return
    }
    onInvite({
      email: email.trim().toLowerCase(),
      username: username.trim(),
      roleOverride: roleSelection === 'default' ? null : roleSelection,
    })
    setEmail('')
    setUsername('')
    setRoleSelection('default')
    setEmailError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Add a new user to this UniFire instance. They will gain access when they first open UniFire in their CRM.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email *</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              placeholder="user@company.com"
            />
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-username">Username *</Label>
            <Input
              id="invite-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Display name"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={roleSelection} onValueChange={setRoleSelection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Company Default ({companyDefaults.defaultRoleName})</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!email.trim() || !username.trim()}>Invite User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------- Main Component ----------

interface UsersTabProps {
  companyId: string
}

export function UsersTab({ companyId: _companyId }: UsersTabProps) {
  const [users, setUsers] = useState<UnifireUser[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [configUserId, setConfigUserId] = useState<string | null>(null)
  const [configTab, setConfigTab] = useState<'profile' | 'access' | 'activity'>('profile')
  const [deactivateId, setDeactivateId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const filtered = useMemo(() => {
    let list = users
    if (statusFilter !== 'all') {
      list = list.filter((u) => u.status === statusFilter)
    }
    if (search) {
      const lower = search.toLowerCase()
      list = list.filter(
        (u) => u.username.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
      )
    }
    return list
  }, [users, search, statusFilter])

  const handleInvite = (data: { email: string; username: string; roleOverride: string | null }) => {
    const newUser: UnifireUser = {
      id: String(Date.now()),
      email: data.email,
      username: data.username,
      status: 'invited',
      roleOverride: data.roleOverride,
      sessionLimitOverride: null,
      searchLimitsOverride: null,
      lastActive: null,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
    }
    setUsers([...users, newUser])
  }

  const handleDeactivate = () => {
    if (!deactivateId) return
    setUsers(users.map((u) => (u.id === deactivateId ? { ...u, status: 'inactive' as const } : u)))
    setDeactivateId(null)
  }

  const handleReactivate = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'active' as const } : u)))
  }

  const handleDelete = () => {
    if (!deleteId) return
    setUsers(users.filter((u) => u.id !== deleteId))
    setDeleteId(null)
    setDeleteConfirmText('')
  }

  const handleUpdateUser = (updated: UnifireUser) => {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)))
  }

  const openConfig = (userId: string, tab: 'profile' | 'access' | 'activity') => {
    setConfigUserId(userId)
    setConfigTab(tab)
  }

  const configUser = users.find((u) => u.id === configUserId) || null
  const deactivateUser = users.find((u) => u.id === deactivateId)
  const deleteUser = users.find((u) => u.id === deleteId)
  const deleteConfirmTarget = deleteUser ? deleteUser.email.split('@')[0].replace(/\./g, '.') : ''

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage terminal users and customize individual access.
              </CardDescription>
            </div>
            <Button onClick={() => setInviteOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">User</th>
                  <th className="px-4 py-2 text-left font-medium w-24">Status</th>
                  <th className="px-4 py-2 text-left font-medium w-36">Role</th>
                  <th className="px-4 py-2 text-center font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                          {getInitials(user.username)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{user.username}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{getEffectiveRoleName(user)}</span>
                        {hasOverrides(user) && (
                          <span className="text-amber-500 text-xs" title="Has custom overrides">★</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openConfig(user.id, 'profile')}
                          title="Configure user"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openConfig(user.id, 'profile')}>
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openConfig(user.id, 'activity')}>
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'inactive' ? (
                              <DropdownMenuItem onClick={() => handleReactivate(user.id)}>
                                Reactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setDeactivateId(user.id)}
                                className="text-amber-600 focus:text-amber-600"
                              >
                                Deactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteId(user.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      {users.length === 0 ? 'No users yet. Invite one to get started.' : 'No users match your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {users.length} users
            {filtered.some(hasOverrides) && (
              <span className="ml-2">
                <span className="text-amber-500">★</span> = has custom overrides (role or limits differ from company default)
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Invite User Modal */}
      <InviteUserModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
        existingEmails={users.map((u) => u.email)}
      />

      {/* User Config Side Panel */}
      <UserConfigPanel
        user={configUser}
        open={!!configUserId}
        onOpenChange={(open) => { if (!open) setConfigUserId(null) }}
        onUpdateUser={handleUpdateUser}
        onDeactivate={(userId) => setDeactivateId(userId)}
        companyDefaults={companyDefaults}
        roles={roles}
        initialTab={configTab}
      />

      {/* Deactivate Confirmation */}
      <AlertDialog open={!!deactivateId} onOpenChange={(open) => !open && setDeactivateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {deactivateUser?.username}?
              They will lose terminal access immediately. This can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} className="bg-amber-600 text-white hover:bg-amber-700">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) { setDeleteId(null); setDeleteConfirmText('') } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete {deleteUser?.username}? This removes all their configuration and activity history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6 pb-2">
            <Label className="text-sm">Type &quot;{deleteConfirmTarget}&quot; to confirm:</Label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mt-2"
              placeholder={deleteConfirmTarget}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteConfirmText !== deleteConfirmTarget}
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
