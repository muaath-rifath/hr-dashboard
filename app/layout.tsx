import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import { IconDashboard, IconBookmark, IconChartBar, IconUsers, IconSettings } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'HR Dashboard',
  description: 'Modern HR management dashboard built with Next.js and TypeScript',
  keywords: ['HR', 'Dashboard', 'Employee Management', 'Next.js'],
  authors: [{ name: 'HR Dashboard Team' }],
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const mobileNav = [
  { name: 'Dashboard', href: '/', icon: IconDashboard },
  { name: 'Employees', href: '/employees', icon: IconUsers },
  { name: 'Bookmarks', href: '/bookmarks', icon: IconBookmark },
  { name: 'Analytics', href: '/analytics', icon: IconChartBar },
  { name: 'Settings', href: '/settings', icon: IconSettings },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white dark:bg-gray-900 font-sans antialiased">
        <ThemeProvider>
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
          </div>
          {/* Sidebar (fixed, below header) - block on md+, hidden on mobile */}
          <div className="fixed top-16 left-0 bottom-0 z-40 hidden md:block md:w-24 lg:w-48">
            <Sidebar />
          </div>
          {/* Main content area, scrollable */}
          <main className="pt-16 pb-16 md:pb-0 w-full min-h-screen bg-white dark:bg-gray-900 md:pl-24 lg:pl-48">
            <div className="w-full h-full min-h-[calc(100vh-4rem)]">
              {children}
            </div>
          </main>
          {/* Bottom navigation bar for mobile */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-14">
            {mobileNav.map((item) => (
              <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <item.icon className="h-6 w-6 mb-0.5" />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            ))}
          </nav>
        </ThemeProvider>
      </body>
    </html>
  )
} 