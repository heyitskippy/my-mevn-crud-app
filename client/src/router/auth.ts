import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import type { Maybe } from '_/types'
import type { Role } from '_/types/users'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function checkRights(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()
  const { currentRole } = storeToRefs(authStore)

  const isLoginPage = to.name === 'login'
  const isEligible = checkRole(currentRole.value, to.meta.roles ?? [])

  if (isEligible) {
    if (isLoginPage) next({ name: 'home' })
    else next()

    return
  }
  if (!isLoginPage) {
    next({ name: 'login' })

    return
  }

  next()
}

export function checkRole(currentRole: Maybe<Role>, roles?: Role[]) {
  if (!currentRole) return false

  return roles?.length ? roles.includes(currentRole) : true
}
