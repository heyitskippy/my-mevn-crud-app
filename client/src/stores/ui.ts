import type { ComputedRef, Ref } from 'vue'

import { defineStore } from 'pinia'

import { syncRef } from '@vueuse/shared'
import { useNProgress } from '@vueuse/integrations/useNProgress'

export const useUiStore = defineStore('ui', () => {
  const { isLoading } = useNProgress(undefined, { showSpinner: false })

  function setProgress(value: Ref | ComputedRef) {
    syncRef(value, isLoading, { direction: 'ltr' })
  }

  return { isLoading, setProgress }
})
