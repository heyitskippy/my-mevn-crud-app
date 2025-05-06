import type { RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router'

import { describe, it, expect, vi } from 'vitest'

import { useError404 } from '@/composables/useError404'

describe('useError404', () => {
  const mockRoute = {
    path: '/test',
    query: { a: 123 },
  } as unknown as RouteLocationNormalizedLoadedGeneric
  const mockRouter = {
    replace: vi.fn(),
  } as unknown as Router

  it('should redirect and have a prop called state that contains the full path and query', async () => {
    await useError404(mockRoute, mockRouter)

    expect(mockRouter.replace).toHaveBeenCalledTimes(1)
    expect(mockRouter.replace).toHaveBeenCalledWith({
      name: '404',
      state: { 404: 'test?a=123' },
    })
  })
})
