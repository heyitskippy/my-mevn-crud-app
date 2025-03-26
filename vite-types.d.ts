/// <reference types="vite/client" />
import type TestAgent from 'supertest/lib/agent'

import 'vue-router'

import * as fixtures from '_/tests/fixtures'

declare module 'vitest' {
  export interface TestContext {
    request: TestAgent
    fixtures: typeof fixtures
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hideInMenu?: boolean
  }
}

export {}
