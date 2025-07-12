import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HR Dashboard',
  description: 'Modern HR management dashboard built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
} 