import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginData, RegisterData } from '@/api'
import * as authApi from '@/api/auth'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize: check if we have a token and fetch user
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    authApi
      .getCurrentUser({ signal: controller.signal })
      .then((user) => {
        setUser(user)
      })
      .catch((e) => {
        if (e instanceof Error && e.name === 'AbortError') {
          return
        }
        // Token invalid, clear it
        localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => {
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  async function login(data: LoginData) {
    const response = await authApi.login(data)
    localStorage.setItem(TOKEN_KEY, response.token)
    setUser(response.user)
  }

  async function register(data: RegisterData) {
    const response = await authApi.register(data)
    localStorage.setItem(TOKEN_KEY, response.token)
    setUser(response.user)
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    }
  }

  async function refreshUser() {
    const user = await authApi.getCurrentUser()
    setUser(user)
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshUser,
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
  return localStorage.getItem(TOKEN_KEY)
}
