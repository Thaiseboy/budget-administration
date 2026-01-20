import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    const storybookContextAlias = {
      find: '@/contexts',
      replacement: path.resolve(__dirname, './mocks/contexts.tsx'),
    };

    const existingAlias = config.resolve?.alias || [];
    const normalizedAliases = Array.isArray(existingAlias)
      ? existingAlias
      : Object.entries(existingAlias).map(([find, replacement]) => ({
          find,
          replacement,
        }));

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: [
          storybookContextAlias,
          ...normalizedAliases.filter((alias) => alias.find !== storybookContextAlias.find),
        ],
      },
    };
  },
};

export default config;
