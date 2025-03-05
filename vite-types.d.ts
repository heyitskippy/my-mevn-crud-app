/// <reference types="vite/client" />
import type TestAgent from 'supertest/lib/agent'

import * as fixtures from '_/tests/fixtures'

declare module 'vitest' {
  export interface TestContext {
    request: TestAgent
    fixtures: typeof fixtures
  }
}

export {}
