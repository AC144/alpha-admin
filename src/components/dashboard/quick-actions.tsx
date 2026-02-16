
import { Link } from 'react-router-dom'
import { Plus, Flame, BarChart3, UserPlus } from 'lucide-react'

const actions = [
  {
    label: 'Add Company',
    href: '/companies/new',
    icon: Plus,
  },
  {
    label: 'Open Terminal',
    href: '/projects/unifire',
    icon: Flame,
  },
  {
    label: 'View Reports',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Invite User',
    href: '/users/invite',
    icon: UserPlus,
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          to={action.href}
          className="quick-action"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Link>
      ))}
    </div>
  )
}
