import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Theme Store State Interface
interface ThemeState {
  theme: 'light' | 'dark'
  systemPreference: boolean
}

// Theme Store Actions Interface
interface ThemeActions {
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setSystemPreference: (enabled: boolean) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

// Combined Store Type
type ThemeStore = ThemeState & ThemeActions

// Initial State
const initialState: ThemeState = {
  theme: 'light',
  systemPreference: false,
}

// Create the Theme Store
export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ...initialState,
        
        // Theme Actions
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
            // Update document class for Tailwind dark mode
            if (typeof document !== 'undefined') {
              document.documentElement.classList.toggle('dark', theme === 'dark')
            }
            return state
          }),
        
        toggleTheme: () =>
          set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            state.theme = newTheme
            // Update document class for Tailwind dark mode
            if (typeof document !== 'undefined') {
              document.documentElement.classList.toggle('dark', newTheme === 'dark')
            }
            return state
          }),
        
        setSystemPreference: (enabled) =>
          set((state) => {
            state.systemPreference = enabled
            return state
          }),
        
        getEffectiveTheme: () => {
          const { theme, systemPreference } = get()
          
          if (systemPreference && typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          }
          
          return theme
        },
      }),
      {
        name: 'theme-store',
        // Only persist theme and systemPreference
        partialize: (state) => ({
          theme: state.theme,
          systemPreference: state.systemPreference,
        }),
      }
    ),
    {
      name: 'theme-store',
    }
  )
) 