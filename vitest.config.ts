import { loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

import {
  mergeConfig,
  configDefaults,
  defineProject,
  defineConfig,
  coverageConfigDefaults,
} from 'vitest/config'

import viteClientConfig from './vite.config.client'

export default () => {
  const mode = 'development'
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    test: {
      env,
      coverage: {
        exclude: [
          'client/src/router/**',
          'client/src/main.ts',
          'server/types/**',
          ...coverageConfigDefaults.exclude,
        ],
      },
      workspace: [
        defineProject({
          server: {
            port: +env.VITE_SERVER_PORT,
          },
          test: {
            name: 'server',
            environment: 'node',
            include: ['tests/*'],
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
    },
  })
}
