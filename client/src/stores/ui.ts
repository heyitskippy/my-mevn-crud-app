import type { ComputedRef, Ref } from 'vue'
import type { ToastState } from '_/types/ui'

import { ref } from 'vue'
import { syncRef } from '@vueuse/shared'
import { useNProgress } from '@vueuse/integrations/useNProgress'

import { defineStore } from 'pinia'

import { cloneDeep } from '_/helpers'

import { DEFAULT_TOASTER_STATE } from '@/constants'

export const useUiStore = defineStore('ui', () => {
  /**
   * Progress
   */
  const { isLoading } = useNProgress(undefined, { showSpinner: false })

  function setProgress(value: Ref | ComputedRef) {
    syncRef(value, isLoading, { direction: 'ltr' })
  }
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

  return { isLoading, setProgress, showSidebar, toasterQueue, addToast, deleteToast }
})
