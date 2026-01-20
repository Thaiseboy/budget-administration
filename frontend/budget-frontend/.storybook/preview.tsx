import type { Preview } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import '../src/index.css'

// Mock AuthContext for Storybook
type MockUser = {
  id: number
  name: string
  email: string
  language: 'nl' | 'en'
}

type MockAuthContextValue = {
  user: MockUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  register: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null)

// Override the useAuth hook for Storybook
;(window as unknown as { __STORYBOOK_AUTH_CONTEXT__: typeof MockAuthContext }).__STORYBOOK_AUTH_CONTEXT__ = MockAuthContext

function MockAuthProvider({ children, language = 'nl' }: { children: ReactNode; language?: 'nl' | 'en' }) {
  const mockUser: MockUser = {
    id: 1,
    name: 'Storybook User',
    email: 'storybook@example.com',
    language,
  }

  const value: MockAuthContextValue = {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    refreshUser: async () => {},
  }

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
}

// Re-export useAuth that uses our mock context
export function useAuth() {
  const ctx = useContext(MockAuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within MockAuthProvider')
  }
  return ctx
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <MockAuthProvider>
        <Story />
      </MockAuthProvider>
    ),
  ],
}

export default preview
