/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
import { fileURLToPath, URL } from 'url';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  publicDir: 'public',
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // Enable sourcemap generation
    rollupOptions: {
      // Build both the default index and the tenant template HTML
      // Use keys that match the basename so outputs are index.html and index_tenant_template.html
      input: {
        default: fileURLToPath(new URL('./index.html', import.meta.url)),
        index_tenant_template: fileURLToPath(new URL('./index_tenant_template.html', import.meta.url)),
      },
      external: [
        /pdfmake/,
        /xlsx/,
        /canvg/,
        '/env-config.js'
      ],
      output: {
        entryFileNames: 'static/js/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(css|scss)$/.test(name)) {
            return 'static/css/[name].[hash][extname]';
          }
          return 'static/[name].[hash][extname]';
        },
      },
    },
  },
  server: {
    allowedHosts: ['app.local.nexoya.io'],
    port: Number(process.env.PORT) || 3000,
  },
  test: {
    root: dirname,
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: [path.join(dirname, '.storybook', 'vitest.setup.ts')],
        },
      },
    ],
  },
});
