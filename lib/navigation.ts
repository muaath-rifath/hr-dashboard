import { Home, Bookmark, BarChart3, Settings, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  description?: string
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Employee directory and management'
  },
  {
    name: 'Bookmarks',
    href: '/bookmarks',
    icon: Bookmark,
    description: 'Saved employees for quick access'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Workforce insights and reports'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application preferences'
  },
]
