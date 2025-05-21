import { describe, it, expect, vi } from 'vitest'

import { ref } from 'vue'

import { useRerenderHack } from '@/composables/useRerenderHack'

describe('useRerenderHack', () => {
  const timeout = 150

  vi.useFakeTimers()

  it('should increase rerenderKey if isLoading is false or increaseKey is called', async () => {
    const isLoading = ref(false)

    const rerender = useRerenderHack(isLoading)
    const { rerenderKey } = rerender

    expect(rerenderKey.value).toBe(0)

    isLoading.value = true
    await vi.advanceTimersByTimeAsync(timeout)
    expect(rerenderKey.value).toBe(0)

    isLoading.value = false
    await vi.advanceTimersByTimeAsync(timeout)
    expect(rerenderKey.value).toBe(1)

    rerender.increaseKey()
    await vi.advanceTimersByTimeAsync(timeout)
    expect(rerenderKey.value).toBe(2)
  })
})
