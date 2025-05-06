import { describe, it, expect } from 'vitest'

import { ref } from 'vue'

import { useRerenderHack } from '@/composables/useRerenderHack'
import { sleep } from '_/helpers'

describe('useRerenderHack', () => {
  const timeout = 150

  it(
    'should increase rerenderKey if isLoading is false or increaseKey is called',
    async () => {
      const isLoading = ref(false)

      const rerender = useRerenderHack(isLoading)
      const { rerenderKey } = rerender

      expect(rerenderKey.value).toBe(0)

      isLoading.value = true
      await sleep(timeout)
      expect(rerenderKey.value).toBe(0)

      isLoading.value = false
      await sleep(timeout)
      expect(rerenderKey.value).toBe(1)

      rerender.increaseKey()
      await sleep(timeout)
      expect(rerenderKey.value).toBe(2)
    },
    timeout * 3 + 100,
  )
})
