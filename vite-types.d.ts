/// <reference types="vite/client" />
import type TestAgent from 'supertest/lib/agent'
import type { IUser, Role, UserEntity } from '_/types/users'

import 'vue-router'

import * as fixtures from '_/tests/fixtures'

declare module 'vitest' {
  export interface TestContext {
    fixtures: typeof fixtures

    request?: TestAgent

    user?: IUser
    userEntity?: UserEntity
    accessToken?: string
    refreshToken?: string
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hideInMenu?: boolean
    roles?: Role[]
  }
}

export {}
