import { loadEnv } from 'vite'

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
          test: {
            name: 'server:unit',
            environment: 'node',
            include: ['./server/**/__tests__/*', './helpers/__tests__/*'],
            setupFiles: ['./server/tests/setup/setup.unit.ts'],
          },
        }),
        defineProject({
          plugins: [tsconfigPaths()],
          server: {
            port: +env.VITE_SERVER_PORT,
          },
          test: {
            name: 'server:integration',
            environment: 'node',
            include: ['./server/tests/*.integration-test.ts'],
            setupFiles: ['./server/tests/setup/setup.integration.ts'],
          },
        }),
        mergeConfig(
          viteClientConfig({ mode }),
          defineProject({
            test: {
              name: 'client:unit',
              environment: 'jsdom',
              setupFiles: ['./client/src/tests/setup/setup.unit.ts'],
              exclude: [...configDefaults.exclude],
            },
          }),
        ),
      ],
      coverage: {
        // see cypress e2e tests
        exclude: [
          'types/*',
          'client/src/router/**',
          'client/src/plugins/*',
          'client/src/stores/*',
          'client/src/tests/setup/*',
          'client/src/views/*',
          'client/src/main.ts',
          'client/src/App.vue',
          'helpers/errors/*',
          ...coverageConfigDefaults.exclude,
        ],
      },
    },
  })
}
