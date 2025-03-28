import type { Ref } from 'vue'

import { ref, watch, nextTick } from 'vue'

export const useRerenderHack = (isLoading: Ref<boolean>) => {
  const rerenderKey = ref(0)
  const iterateKey = () => rerenderKey.value++

  watch(
    () => isLoading.value,
    () => {
      if (isLoading.value) return

      nextTick(iterateKey)
    },
  )

  return {
    rerenderKey,
    iterateKey,
  }
}
