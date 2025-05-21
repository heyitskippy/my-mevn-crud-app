/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { API } from '@/plugins/api'
import type { Maybe } from '_/types'
import type { LoginForm, ToastState } from '_/types/ui'
import type { NullableUserEntity } from '_/types/users'

import { computed, inject, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { isEqual } from 'lodash-es'

import { defineStore, storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

import { cloneDeep } from '_/helpers'

const resource = 'auth'

export const useAuthStore = defineStore(resource, () => {
  const api = inject('api') as API
  if (!api) throw new Error('API plugin not injected')

  api.setRefresh(async () => await refresh())

  const ui = useUiStore()
  const { storage } = storeToRefs(ui)

  const currentUser = ref<Maybe<NullableUserEntity>>(cloneDeep(storage.value.currentUser))
  const currentRole = computed(() => currentUser.value?.role ?? null)

  const accessToken = ref<Maybe<string>>(storage.value.accessToken)
  watch(accessToken, api.setAccessToken.bind(api), { immediate: true })

  watch(
    () => [currentUser, accessToken],
    () => {
      if (
        !isEqual(storage.value.currentUser, currentUser.value) ||
        storage.value.accessToken !== accessToken.value
      ) {
        storage.value = {
          currentUser: cloneDeep(currentUser.value),
          accessToken: accessToken.value,
        }
      }
    },
    { deep: true },
  )

  const isLoading = ref(false)

  async function login(email: string, password: string) {
    const options: Partial<ToastState> = {}
    let errors: Maybe<Partial<Record<keyof LoginForm | 'server', string>>> = null

    isLoading.value = true

    try {
      const data = await api.post<{ user: NullableUserEntity; accessToken: string }>(
        `/${resource}/login`,
        { email, password },
      )

      accessToken.value = data.accessToken
      currentUser.value = data.user
    } catch (e: any) {
      options.text = 'Login failed'
      errors = e.errors

      console.error('[login]', `/${resource}/\n`, e)
    } finally {
      isLoading.value = false

      if (options.text) ui.addToast(options)
    }

    return errors
  }

  async function refresh() {
    if (!currentUser.value || !accessToken.value) return

    isLoading.value = true

    try {
      const data = await api.get<{ user: NullableUserEntity; accessToken: string }>(
        `/${resource}/refresh`,
      )

      accessToken.value = data.accessToken
      currentUser.value = data.user

      queueMicrotask(() => window.location.reload())
    } catch (e) {
      console.error('[refresh]', `/${resource}/\n`, e)

      await logout()
    } finally {
      isLoading.value = false
    }
  }

  async function register(email: string, password: string) {
    const options: Partial<ToastState> = {}
    let errors: Maybe<Partial<Record<keyof LoginForm | 'server', string>>> = null

    isLoading.value = true

    try {
      const data = await api.post<{ user: NullableUserEntity; accessToken: string }>(
        `/${resource}/register`,
        { email, password },
      )

      accessToken.value = data.accessToken
      currentUser.value = data.user
    } catch (e: any) {
      options.text = 'Registration failed'
      errors = e.errors

      console.error('[register]', `/${resource}/\n`, e)
    } finally {
      isLoading.value = false

      if (options.text) ui.addToast(options)
    }

    return errors
  }

  const router = useRouter()

  async function logout() {
    accessToken.value = null
    currentUser.value = null

    await router.push({ name: 'login' })
  }

  return {
    login,
    logout,
    refresh,
    register,
    accessToken,
    currentUser,
    currentRole,
    isLoading,
  }
})
