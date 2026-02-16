
import { Plus, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

interface CompanyUsersProps {
  companyId: string
}

// Mock data - replace with GraphQL query
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@travelpelicans.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: 'user-2',
    name: 'Bob Williams',
    email: 'bob@travelpelicans.com',
    role: 'member',
    status: 'active',
    createdAt: '2024-02-15',
  },
]

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
}

export function CompanyUsers({ companyId: _companyId }: CompanyUsersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">Users</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage users for this company.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <table className="data-table">
          <thead>
            <tr>
              <th className="pb-3">User</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Role</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant="success">{user.status}</Badge>
                </td>
                <td>{roleLabels[user.role]}</td>
                <td className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
