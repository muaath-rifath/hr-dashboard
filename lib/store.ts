import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, DashboardStats } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

interface DashboardState {
  stats: DashboardStats | null
  isLoading: boolean
  fetchStats: () => Promise<void>
  setStats: (stats: DashboardStats) => void
}

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // TODO: Implement actual login logic
          const mockUser: User = {
            id: '1',
            name: 'John Doe',
            email,
            role: 'admin',
            department: 'HR',
            position: 'HR Manager',
            hireDate: '2023-01-15',
            status: 'active',
          }
          set({ user: mockUser, isAuthenticated: true })
        } catch (error) {
          console.error('Login failed:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },
    }),
    { name: 'auth-store' }
  )
)

// Dashboard Store
export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      stats: null,
      isLoading: false,
      fetchStats: async () => {
        set({ isLoading: true })
        try {
          // TODO: Implement actual API call
          const mockStats: DashboardStats = {
            totalEmployees: 150,
            activeEmployees: 142,
            departments: 8,
            pendingRequests: 12,
            thisMonthHires: 5,
            thisMonthTerminations: 2,
          }
          set({ stats: mockStats })
        } catch (error) {
          console.error('Failed to fetch stats:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      setStats: (stats: DashboardStats) => {
        set({ stats })
      },
    }),
    { name: 'dashboard-store' }
  )
)

// Theme Store
export const useThemeStore = create<ThemeState>()(
  devtools(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        // Update document class for Tailwind dark mode
        document.documentElement.classList.toggle('dark')
      },
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme })
        // Update document class for Tailwind dark mode
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    }),
    { name: 'theme-store' }
  )
) 