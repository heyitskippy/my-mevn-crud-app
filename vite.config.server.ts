import { defineConfig, loadEnv } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default ({ mode }: { mode: 'development' | 'production' }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [
      tsconfigPaths(),
      // https://github.com/axe-me/vite-plugin-node#readme
      ...VitePluginNode({
        adapter: 'express',
        appPath: './server',
        exportName: 'server',
        initAppOnBoot: true,
      }),
    ],
    server: {
      port: +env.VITE_SERVER_PORT,
    },
    build: {
      rollupOptions: {
        input: './server',
        output: {
          dir: './dist/server',
        },
      },
      sourcemap: true,
      minify: true,
    },
  })
}
