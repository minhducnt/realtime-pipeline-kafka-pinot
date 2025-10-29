'use client'

import React from 'react'
import { ThemeToggle } from '../ThemeToggle'
import { Button } from './button'
import { cn } from '../../lib/utils'
import { PanelLeft, PanelLeftOpen } from 'lucide-react'

interface HeaderProps {
  className?: string
  onSidebarToggle?: () => void
  sidebarCollapsed?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  className,
  onSidebarToggle,
  sidebarCollapsed = false
}) => {
  return (
    <header className={cn(
      "flex h-16 items-center justify-between border-b transition-all duration-300 ease-in-out",
      // Beautiful light theme gradient background
      "bg-gradient-to-r from-white via-blue-50/30 to-white",
      "border-blue-200/50 shadow-sm backdrop-blur-sm",
      className
    )}>
      {/* Left side - Sidebar Toggle + Title/Breadcrumb */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="h-8 w-8 ml-5 flex-shrink-0 hover:bg-gradient-to-r hover:from-accent/60 hover:to-accent/40 hover:text-accent-foreground hover:shadow-sm hover:border hover:border-accent/30 transition-all duration-200"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Separator */}
        <div className="h-4 w-px bg-gradient-to-b from-blue-300 via-blue-400 to-blue-300" />

        {/* Title/Breadcrumb */}
        <div className="flex flex-col">
          <h1 className="font-semibold transition-all duration-200 text-sm md:text-base lg:text-lg text-slate-800">
            Real-Time Transaction Dashboard
          </h1>
          {/* Show subtitle on larger screens */}
          <p className="hidden md:block text-xs text-slate-600 -mt-1">
            Live fraud detection and monitoring
          </p>
        </div>
      </div>
    </header>
  )
}
