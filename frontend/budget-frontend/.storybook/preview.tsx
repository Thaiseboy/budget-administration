import type { Preview } from '@storybook/react-vite'
import { AuthProvider, ToastProvider, ThemeProvider, ConfirmProvider } from '@/contexts'
import '../src/index.css'

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' },
      ],
      showName: true,
    },
  },
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
    (Story, context) => (
      <AuthProvider>
        <ThemeProvider forcedTheme={context.globals.theme}>
          <ToastProvider>
            <ConfirmProvider>
              <Story />
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    ),
  ],
}

export default preview
