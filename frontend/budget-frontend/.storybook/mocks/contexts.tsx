import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Mock User type
type MockUser = {
  id: number
  name: string
  email: string
  language: 'nl' | 'en'
  theme: 'light' | 'dark'
  email_verified_at?: string | null
}

// ============ Auth Context ============
type AuthContextValue = {
  user: MockUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  register: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const mockUser: MockUser = {
    id: 1,
    name: 'Storybook User',
    email: 'storybook@example.com',
    language: 'nl',
    theme: 'dark',
    email_verified_at: '2024-01-01T00:00:00Z',
  }

  const value: AuthContextValue = {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    refreshUser: async () => {},
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

export function getAuthToken(): string | null {
  return 'mock-token'
}

// ============ Toast Context ============
type ToastType = 'success' | 'error' | 'info' | 'warning'

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = (message: string, type: ToastType = 'info') => {
    console.log(`[Storybook Toast - ${type}]: ${message}`)
  }

  return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

// ============ Confirm Context ============
type ConfirmContextValue = {
  confirm: (options: { title: string; message: string }) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const confirm = async () => true

  return <ConfirmContext.Provider value={{ confirm }}>{children}</ConfirmContext.Provider>
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return ctx
}

// ============ Theme Context ============
type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type ThemeProviderProps = {
  children: ReactNode
  initialTheme?: Theme
  forcedTheme?: Theme
}

export function ThemeProvider({ children, initialTheme = 'dark', forcedTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(forcedTheme ?? initialTheme)
  const activeTheme = forcedTheme ?? theme

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(activeTheme)
  }, [activeTheme])

  return <ThemeContext.Provider value={{ theme: activeTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
