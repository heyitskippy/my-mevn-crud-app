/// <reference types="vite/client" />
import type TestAgent from 'supertest/lib/agent'

import fixtures from './server/tests/setup/fixtures.integration'

declare module 'vitest' {
  export interface TestContext {
    request: TestAgent
    fixtures: typeof fixtures
  }
}

export {}
