'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { ScrollArea } from './scroll-area'
import {
  LayoutDashboard,
  CreditCard,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Activity',
    href: '/activity',
    icon: Activity,
  }
]

const bottomNavigationItems = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System settings'
  }
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onToggle?: () => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, onToggle, ...props }, ref) => {
    const pathname = usePathname()

    const isActive = (href: string) => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname.startsWith(href)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col border-r transition-all duration-300 ease-in-out",
          // Beautiful light theme gradient background
          "bg-gradient-to-b from-white via-slate-50/80 to-white",
          "shadow-xl border-slate-200/60",
          // Enhanced collapsed state
          collapsed
            ? "w-16 shadow-2xl border-blue-200/50"
            : "w-64 shadow-2xl border-blue-200/50",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b border-blue-200/50 px-4 bg-gradient-to-r from-blue-50/40 to-slate-50/30 backdrop-blur-sm">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 shadow-lg border border-blue-200/30">
              <Activity className="h-4 w-4 text-white drop-shadow-sm" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold truncate text-slate-800">Transaction Hub</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 hover:text-blue-700 hover:shadow-sm hover:border hover:border-blue-200/50 group relative",
                      active
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-slate-600 hover:text-blue-700",
                      collapsed ? "justify-center px-2" : "space-x-3"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-md p-1.5 transition-all duration-200",
                      active && "bg-blue-200 shadow-sm",
                      !active && "group-hover:bg-blue-100 group-hover:shadow-sm"
                    )}>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                    </div>
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{item.name}</div>
                      </div>
                    )}
                    {/* Active indicator */}
                    {active && !collapsed && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 animate-pulse shadow-sm" />
                    )}
                    {/* Collapsed active indicator */}
                    {active && collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full animate-pulse shadow-sm" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <div className="rounded-lg p-2 bg-gradient-to-r from-blue-50/40 to-slate-50/30 border border-blue-200/50 shadow-sm backdrop-blur-sm">
                {bottomNavigationItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:text-blue-700 hover:shadow-sm hover:border hover:border-blue-200/50 group relative",
                        active
                          ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                          : "text-slate-600 hover:text-blue-700",
                        collapsed ? "justify-center px-2" : "space-x-3"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <div className={cn(
                        "flex items-center justify-center rounded-md p-1.5 transition-all duration-200",
                        active && "bg-blue-200 shadow-sm",
                        !active && "group-hover:bg-blue-100 group-hover:shadow-sm"
                      )}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                      </div>
                      {!collapsed && <span className="truncate font-medium">{item.name}</span>}
                      {/* Collapsed active indicator */}
                      {active && collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full animate-pulse shadow-sm" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </ScrollArea>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar }
