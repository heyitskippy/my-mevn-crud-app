import type { ComputedRef, Ref } from 'vue'
import type { Maybe } from '_/types'
import type { ToastState } from '_/types/ui'
import type { NullableUserEntity } from '_/types/users'

import { ref } from 'vue'

import { useStorage, syncRef } from '@vueuse/core'
import { useNProgress } from '@vueuse/integrations/useNProgress'

import { defineStore } from 'pinia'

import { cloneDeep } from '_/helpers'

import { DEFAULT_TOASTER_STATE, STORE_KEY } from '@/constants'

export const useUiStore = defineStore('ui', () => {
  /**
   * Progress
   */
  const { isLoading } = useNProgress(undefined, { showSpinner: false })

  function setProgress(value: Ref | ComputedRef) {
    syncRef(value, isLoading, { direction: 'ltr' })
  }
  /**
   * LocalStorage
   * */
  const storage = useStorage<{
    currentUser: Maybe<NullableUserEntity>
    accessToken: Maybe<string>
  }>(STORE_KEY, {
    currentUser: null,
    accessToken: null,
  })
  /**
   * Sidebar
   */
  const showSidebar = ref(false)
  /**
   * Toast
   */
  const toasterQueue = ref<ToastState[]>([])

  function addToast(options: Partial<ToastState>) {
    toasterQueue.value.push({
      key: Symbol(),
      ...cloneDeep(DEFAULT_TOASTER_STATE),
      ...options,
    })
  }

  function deleteToast(key: symbol) {
    const index = toasterQueue.value.findIndex((toast) => toast.key === key)
    if (index === -1) return

    toasterQueue.value.splice(index, 1)
  }

  return {
    /**
     * Progress
     */
    isLoading,
    setProgress,
    /**
     * LocalStorage
     */
    storage,
    /**
     * Sidebar
     */
    showSidebar,
    /**
     * Toast
     */
    toasterQueue,
    addToast,
    deleteToast,
  }
})
