import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'

import type { Maybe } from '_/types'

import { isEmpty } from '_/helpers'

export const useError404 = async (route: RouteLocationNormalizedGeneric, router: Router) => {
  const path = route.path.substring(1)
  const state: Record<number, Maybe<string>> = { 404: null }

  if (path.length) {
    state[404] = path

    if (!isEmpty(route.query)) {
      state[404] = `${state[404]}?${new URLSearchParams(route.query as Record<string, string>)}`
    }
  }

  await router.replace({
    name: '404',
    state,
  })
}
