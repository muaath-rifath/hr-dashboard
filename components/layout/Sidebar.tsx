'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconDashboard, IconBookmark, IconChartBar, IconUsers, IconSettings } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: IconDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'Employees',
    href: '/employees',
    icon: IconUsers,
    description: 'Manage employee data'
  },
  {
    name: 'Bookmarks',
    href: '/bookmarks',
    icon: IconBookmark,
    description: 'Saved employees'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: IconChartBar,
    description: 'Reports and insights'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: IconSettings,
    description: 'System configuration'
  }
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop - only show on mobile when sidebar is open */}
      <div 
        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        // Hide sidebar on mobile, show on md+
        'hidden md:block md:fixed md:top-0 md:bottom-0 md:left-0 md:z-50 md:w-24 lg:w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'md:translate-x-0' : 'md:-translate-x-full'
      )}>
        <div className="flex flex-col h-screen">
          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4 space-y-1 pt-24">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center lg:flex-row lg:items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  )}
                  onClick={onClose}
                >
                  <item.icon 
                    className={cn(
                      'h-5 w-5 mb-1 lg:mb-0 lg:mr-3',
                      isActive 
                        ? 'text-blue-500 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    )} 
                  />
                  {/* Show label only on lg+ (desktop) */}
                  <span className="hidden lg:inline text-xs">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
} 