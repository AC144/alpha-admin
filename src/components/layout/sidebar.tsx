import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sidebarConfig, type NavItem } from './sidebar-config'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">α</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold tracking-tight">
                Alpha Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-6">
            {sidebarConfig.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.title && !collapsed && (
                  <h4 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg bg-muted/50 p-3',
              collapsed && 'justify-center p-2'
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              SA
            </div>
            {!collapsed && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">admin@alpha.io</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}

interface SidebarItemProps {
  item: NavItem
  collapsed: boolean
  depth?: number
}

function SidebarItem({ item, collapsed, depth = 0 }: SidebarItemProps) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = location.pathname === item.href ||
    (hasChildren && item.children?.some(child => location.pathname.startsWith(child.href)))

  const content = (
    <>
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span className="ml-auto">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </>
      )}
    </>
  )

  const itemClasses = cn(
    'sidebar-item',
    isActive && !hasChildren && 'active',
    isActive && hasChildren && 'text-foreground font-medium',
    depth > 0 && 'pl-10'
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink to={item.href} className={itemClasses}>
            {content}
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.title}
          {item.badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  if (hasChildren) {
    return (
      <div>
        <button onClick={() => setIsOpen(!isOpen)} className={cn(itemClasses, 'w-full')}>
          {content}
        </button>
        {isOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink to={item.href} className={itemClasses}>
      {content}
    </NavLink>
  )
}
