import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      config.env = {
        ...process.env,
        ...config.env,
      }
      return config
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: process.env.VITE_CYPRESS,
  },
})
