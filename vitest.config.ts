/**
 * Only client
 */
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults, coverageConfigDefaults } from 'vitest/config'
import viteConfig from './vite.config.client'

export default mergeConfig(
  viteConfig({ mode: 'development' }),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        exclude: ['client/src/router/**', 'client/src/main.ts', ...coverageConfigDefaults.exclude],
      },
    },
  }),
)
