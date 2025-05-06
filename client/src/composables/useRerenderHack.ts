import type { Ref } from 'vue'

import { watch, ref } from 'vue'
import { refDebounced } from '@vueuse/core'

export const useRerenderHack = (isLoading: Ref<boolean>) => {
  const key = ref(0)
  const rerenderKey = refDebounced(key, 100)

  const increaseKey = () => key.value++

  watch(
    () => isLoading.value,
    () => {
      if (isLoading.value) return

      increaseKey()
    },
  )

  return {
    rerenderKey,
    increaseKey,
  }
}
