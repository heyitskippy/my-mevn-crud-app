import { loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

import {
  mergeConfig,
  configDefaults,
  defineProject,
  defineConfig,
  coverageConfigDefaults,
} from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

import viteClientConfig from './vite.config.client'

export default () => {
  const mode = 'development'
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    test: {
      env,
      workspace: [
        defineProject({
          plugins: [tsconfigPaths()],
          server: {
            port: +env.VITE_SERVER_PORT,
          },
          test: {
            name: 'server:integration',
            environment: 'node',
            include: ['tests/*.integration-test.ts'],
            setupFiles: ['tests/setup/setup.integration.ts'],
            root: fileURLToPath(new URL('./server', import.meta.url)),
          },
        }),
        defineProject({
          plugins: [tsconfigPaths()],
          test: {
            name: 'server:unit',
            environment: 'node',
            include: ['./**/__tests__/*'],
            setupFiles: ['tests/setup/setup.unit.ts'],
            root: fileURLToPath(new URL('./server', import.meta.url)),
          },
        }),
        mergeConfig(
          viteClientConfig({ mode }),
          defineProject({
            test: {
              name: 'client',
              environment: 'jsdom',
              exclude: [...configDefaults.exclude, 'e2e/**'],
              root: fileURLToPath(new URL('./client', import.meta.url)),
            },
          }),
        ),
      ],
      coverage: {
        exclude: ['client/src/router/**', 'client/src/main.ts', ...coverageConfigDefaults.exclude],
      },
    },
  })
}
