import { useState, useEffect } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { cn } from '@/lib/utils'
import type { UnifireUser, RoleOption } from './users-tab'

// ---------- Types ----------

export interface CompanyDefaults {
  defaultRoleId: string
  defaultRoleName: string
  sessionLimit: number
  searchLimits: {
    basic: number
    withFlex: number
    alternateCity: number
    perJourney: number
  }
}

interface ActivityEntry {
  id: string
  timestamp: string
  command: string
  response: string
  denied: boolean
}

// ---------- Mock Activity Data ----------

const mockActivity: ActivityEntry[] = [
  {
    id: 'a1',
    timestamp: '2026-02-05T14:32:05Z',
    command: '*R',
    response: '1.1 JOHNSON/ALICE\n 2 UA 456 Y 15MAR ORDLAX HK1  0800 1030\n 3 UA 789 Y 16MAR LAXORD HK1  1200 1830',
    denied: false,
  },
  {
    id: 'a2',
    timestamp: '2026-02-05T14:31:22Z',
    command: 'WC1-3',
    response: 'PRICE RESPONSE\n FARE  USD  456.00\n TAX   USD   45.60\n TOTAL USD  501.60',
    denied: false,
  },
  {
    id: 'a3',
    timestamp: '2026-02-05T14:30:58Z',
    command: 'IG',
    response: 'SIGN IN - ALICE.JOHNSON - L4FL\n** SIGNED IN **',
    denied: false,
  },
  {
    id: 'a4',
    timestamp: '2026-02-04T16:12:33Z',
    command: 'ET',
    response: 'COMMAND NOT AUTHORIZED FOR ROLE',
    denied: true,
  },
  {
    id: 'a5',
    timestamp: '2026-02-04T16:10:05Z',
    command: 'FQD',
    response: 'FARE DISPLAY\n ORDLAX  UA  Y  456.00  RT\n         AA  Y  478.00  RT',
    denied: false,
  },
  {
    id: 'a6',
    timestamp: '2026-02-04T15:55:20Z',
    command: '*S',
    response: 'NO DATA',
    denied: false,
  },
  {
    id: 'a7',
    timestamp: '2026-02-03T11:20:15Z',
    command: '0UDOPEN/USD/1',
    response: 'UD CREATED\n ITINERARY PRICING IN PROGRESS...\n TOTAL USD 1245.00',
    denied: false,
  },
  {
    id: 'a8',
    timestamp: '2026-02-03T11:18:44Z',
    command: 'QC',
    response: 'COMMAND NOT AUTHORIZED FOR ROLE',
    denied: true,
  },
]

// ---------- Helpers ----------

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ---------- Profile Tab ----------

function ProfileTab({
  user,
  onUpdate,
}: {
  user: UnifireUser
  onUpdate: (u: UnifireUser) => void
}) {
  const [username, setUsername] = useState(user.username)

  useEffect(() => { setUsername(user.username) }, [user.username])

  const handleSave = () => {
    if (username.trim() && username !== user.username) {
      onUpdate({ ...user, username: username.trim() })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Email</Label>
        <Input value={user.email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">Used for passkey authentication. Cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="config-username">Username</Label>
        <div className="flex gap-2">
          <Input
            id="config-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Display name"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!username.trim() || username === user.username}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Created</Label>
          <p className="text-sm">{formatDate(user.createdAt)}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Last Active</Label>
          <p className="text-sm">{user.lastActive ? formatDate(user.lastActive) : 'Never'}</p>
        </div>
      </div>
    </div>
  )
}

// ---------- Access Tab ----------

function AccessTab({
  user,
  onUpdate,
  companyDefaults,
  roles,
}: {
  user: UnifireUser
  onUpdate: (u: UnifireUser) => void
  companyDefaults: CompanyDefaults
  roles: RoleOption[]
}) {
  const roleValue = user.roleOverride || 'default'
  const isRoleCustom = user.roleOverride !== null
  const isSessionCustom = user.sessionLimitOverride !== null
  const effectiveSession = user.sessionLimitOverride ?? companyDefaults.sessionLimit

  type LimitKey = 'basic' | 'withFlex' | 'alternateCity' | 'perJourney'
  const limitKeys: { key: LimitKey; label: string }[] = [
    { key: 'basic', label: 'Basic' },
    { key: 'withFlex', label: 'With Flex' },
    { key: 'alternateCity', label: 'Alternate City' },
    { key: 'perJourney', label: 'Per Journey' },
  ]

  const getEffectiveLimit = (key: LimitKey): number => {
    return user.searchLimitsOverride?.[key] ?? companyDefaults.searchLimits[key]
  }

  const isLimitCustom = (key: LimitKey): boolean => {
    return user.searchLimitsOverride?.[key] != null
  }

  const hasAnyLimitOverride = limitKeys.some((l) => isLimitCustom(l.key))

  const handleRoleChange = (val: string) => {
    onUpdate({ ...user, roleOverride: val === 'default' ? null : val })
  }

  const handleSessionChange = (val: string) => {
    const num = parseInt(val, 10)
    if (isNaN(num) || num < 0) return
    onUpdate({ ...user, sessionLimitOverride: num === companyDefaults.sessionLimit ? null : num })
  }

  const resetSession = () => {
    onUpdate({ ...user, sessionLimitOverride: null })
  }

  const handleLimitChange = (key: LimitKey, val: string) => {
    const num = parseInt(val, 10)
    if (isNaN(num) || num < 0) return

    const current = user.searchLimitsOverride || { basic: null, withFlex: null, alternateCity: null, perJourney: null }
    const updated = { ...current, [key]: num === companyDefaults.searchLimits[key] ? null : num }

    // If all null, set entire override to null
    const allNull = Object.values(updated).every((v) => v === null)
    onUpdate({ ...user, searchLimitsOverride: allNull ? null : updated })
  }

  const resetAllLimits = () => {
    onUpdate({ ...user, searchLimitsOverride: null })
  }

  return (
    <div className="space-y-6">
      {/* Role */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-medium">Role</Label>
          {isRoleCustom && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleRoleChange('default')}>
              <RotateCcw className="mr-1 h-3 w-3" /> Reset to default
            </Button>
          )}
        </div>
        <Select value={roleValue} onValueChange={handleRoleChange}>
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
        <p className="text-xs text-muted-foreground">
          {isRoleCustom ? (
            <span className="text-amber-600">Custom ★</span>
          ) : (
            <span>Inheriting from company ✓</span>
          )}
        </p>
      </div>

      {/* Session Limit */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-medium">Session Limit</Label>
          {isSessionCustom && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetSession}>
              <RotateCcw className="mr-1 h-3 w-3" /> Reset to default
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            value={effectiveSession}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="h-8 w-20 font-mono text-sm"
          />
          <span className="text-sm text-muted-foreground">concurrent sessions</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Company default: {companyDefaults.sessionLimit}
        </p>
      </div>

      {/* Search Limits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Search Limits</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Override per-user search request limits.</p>
          </div>
          {hasAnyLimitOverride && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetAllLimits}>
              <RotateCcw className="mr-1 h-3 w-3" /> Reset all
            </Button>
          )}
        </div>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium w-24">Per User</th>
                <th className="px-3 py-2 text-left font-medium w-28">Company Default</th>
              </tr>
            </thead>
            <tbody>
              {limitKeys.map(({ key, label }) => (
                <tr key={key} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{label}</span>
                      {isLimitCustom(key) && <span className="text-amber-500 text-xs">★</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      value={getEffectiveLimit(key)}
                      onChange={(e) => handleLimitChange(key, e.target.value)}
                      className="h-7 w-20 font-mono text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 text-muted-foreground font-mono text-sm">
                    {companyDefaults.searchLimits[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          {hasAnyLimitOverride ? (
            <span className="text-amber-600">Custom ★</span>
          ) : (
            <span>Inheriting from company ✓</span>
          )}
        </p>
      </div>
    </div>
  )
}

// ---------- Activity Tab ----------

const periodOptions = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

function ActivityTab({ user }: { user: UnifireUser }) {
  const [period, setPeriod] = useState('7d')
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(10)

  const filtered = mockActivity.filter((entry) => {
    if (!search) return true
    const lower = search.toLowerCase()
    return entry.command.toLowerCase().includes(lower) || entry.response.toLowerCase().includes(lower)
  })

  const visible = filtered.slice(0, visibleCount)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (!user.lastActive) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No activity recorded.</p>
        <p className="text-xs mt-1">This user has not signed in yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground whitespace-nowrap">Period:</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search commands..."
          className="h-8 text-xs flex-1"
        />
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {visible.map((entry) => {
          const isExpanded = expandedIds.has(entry.id)
          return (
            <div
              key={entry.id}
              className={cn(
                'rounded-lg border p-3',
                entry.denied && 'border-red-200 bg-red-50/30'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(entry.timestamp)}
                </span>
                {entry.denied && (
                  <Badge variant="outline" className="text-[10px] border-red-300 text-red-600">
                    DENIED
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">CMD →</span>
                <span className={cn('font-mono text-sm font-medium', entry.denied && 'text-red-600')}>
                  {entry.command}
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleExpand(entry.id)}
                className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')} />
                {isExpanded ? 'Hide' : 'Show'} response
              </button>
              {isExpanded && (
                <pre className="mt-2 p-2 rounded bg-muted/50 border text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-[200px] overflow-y-auto">
                  {entry.response}
                </pre>
              )}
            </div>
          )
        })}

        {visible.length === 0 && (
          <div className="py-6 text-center text-muted-foreground text-sm">
            No commands match your search.
          </div>
        )}
      </div>

      {/* Load more */}
      {visibleCount < filtered.length && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setVisibleCount((c) => c + 10)}
        >
          Load more ({filtered.length - visibleCount} remaining)
        </Button>
      )}
    </div>
  )
}

// ---------- Main Panel ----------

interface UserConfigPanelProps {
  user: UnifireUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateUser: (user: UnifireUser) => void
  onDeactivate: (userId: string) => void
  companyDefaults: CompanyDefaults
  roles: RoleOption[]
  initialTab?: 'profile' | 'access' | 'activity'
}

export function UserConfigPanel({
  user,
  open,
  onOpenChange,
  onUpdateUser,
  onDeactivate,
  companyDefaults,
  roles,
  initialTab = 'profile',
}: UserConfigPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

  if (!user) return null

  const statusConfig = {
    active: { label: 'Active', className: 'text-green-600' },
    invited: { label: 'Invited', className: 'text-gray-500' },
    inactive: { label: 'Inactive', className: 'text-red-600' },
  }
  const sc = statusConfig[user.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg w-full flex flex-col overflow-hidden p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                {getInitials(user.username)}
              </div>
              <div className="min-w-0">
                <SheetTitle className="truncate">{user.username}</SheetTitle>
                <SheetDescription className="truncate">{user.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={cn('text-sm font-medium', sc.className)}>
                {user.status === 'active' && '● '}
                {user.status === 'invited' && '○ '}
                {user.status === 'inactive' && '⊘ '}
                {sc.label}
              </span>
            </div>
            {user.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                onClick={() => { onDeactivate(user.id); onOpenChange(false) }}
              >
                Deactivate User
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-6 mt-4 mb-0 w-auto justify-start">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TabsContent value="profile" className="mt-0">
                <ProfileTab user={user} onUpdate={onUpdateUser} />
              </TabsContent>
              <TabsContent value="access" className="mt-0">
                <AccessTab user={user} onUpdate={onUpdateUser} companyDefaults={companyDefaults} roles={roles} />
              </TabsContent>
              <TabsContent value="activity" className="mt-0">
                <ActivityTab user={user} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
