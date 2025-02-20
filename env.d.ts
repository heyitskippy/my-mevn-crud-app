/// <reference types="vite/client" />
import type TestAgent from 'supertest/lib/agent'

import fixtures from './server/tests/setup/fixtures.integration'

interface ImportMetaEnv {
  VITE_BASE: string
  VITE_CLIENT_PORT: number
  VITE_SERVER_PORT: number
  VITE_API: string
  VITE_CYPRESS: string

  VITE_MONGO_CONTAINER: string
  VITE_MONGO_HOST: string
  VITE_MONGO_PORT: number
  VITE_MONGO_DB_NAME: string
  VITE_MONGO_USERNAME: string
  VITE_MONGO_PASSWORD: string
}

declare module 'vitest' {
  export interface TestContext {
    request: TestAgent
    fixtures: typeof fixtures
  }
}

export {}
