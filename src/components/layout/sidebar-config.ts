import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  BarChart3,
  ClipboardList,
  Users,
  Settings,
  Activity,
  Flame,
  TrendingDown,
  Search,
  Database,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
  children?: NavItem[]
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

export const sidebarConfig: NavGroup[] = [
  {
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Companies',
        href: '/companies',
        icon: Building2,
      },
    ],
  },
  {
    title: 'Client Projects',
    items: [
      {
        title: 'UniFire',
        href: '/projects/unifire',
        icon: Flame,
      },
      {
        title: 'Price Tracker',
        href: '/projects/price-tracker',
        icon: TrendingDown,
      },
      {
        title: 'BitFinder',
        href: '/projects/bit-finder',
        icon: Search,
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
      {
        title: 'Audit',
        href: '/audit',
        icon: ClipboardList,
        children: [
          { title: 'Services', href: '/audit/services', icon: Activity },
          { title: 'Projects', href: '/audit/projects', icon: FolderKanban },
          { title: 'Users', href: '/audit/users', icon: Users },
        ],
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        title: 'Users',
        href: '/users',
        icon: Users,
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
      {
        title: 'Info Dock',
        href: '/info-dock',
        icon: Database,
      },
      {
        title: 'Status',
        href: '/status',
        icon: Activity,
      },
    ],
  },
]
