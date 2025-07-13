'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'
import { navigationItems } from '@/lib/navigation'

export function TopNavigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4">
        <div className="flex h-14 items-center justify-between relative">
          {/* Left side - Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HR</span>
            </div>
            <h1 className="text-lg font-semibold hidden sm:block">HR Dashboard</h1>
          </div>

          {/* Center Navigation - Hidden on mobile, visible on tablet/desktop */}
          <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      // Tablet: icon only
                      "md:px-2 lg:px-3",
                      isActive && "bg-muted font-medium"
                    )}
                    title={item.name} // Tooltip for tablet view
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {/* Desktop: show label */}
                    <span className="hidden lg:block">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right side - Theme toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
