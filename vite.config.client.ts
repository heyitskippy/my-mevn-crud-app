import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default ({ mode }: { mode: 'development' | 'production' }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    root: './client',
    envDir: '../',
    plugins: [
      tsconfigPaths({ root: '../' }),
      vue({ features: { optionsAPI: false } }),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      // for .vue files
      alias: {
        _: fileURLToPath(new URL('.', import.meta.url)),
        '@': fileURLToPath(new URL('./client/src', import.meta.url)),
      },
    },
    server: {
      port: +env.VITE_CLIENT_PORT,
      proxy: {
        [env.VITE_API]: {
          target: `${env.VITE_BASE}:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: false,
      sourcemap: true,
    },
  })
}
