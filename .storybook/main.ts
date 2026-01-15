import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
  addons: [
    'storybook-addon-apollo-client',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest'
  ],
  framework: {
    name: '@storybook/react-vite',
  },
  docs: { autodocs: true },
  typescript: { reactDocgen: false },
};

export default config;


