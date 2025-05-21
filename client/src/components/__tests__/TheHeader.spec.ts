import { Role } from '_/types/users'

import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'

import routes from '@/router/routes'
import { checkRole } from '@/router/auth'

import User from '@/models/User'

import TheHeader from '../layout/TheHeader.vue'

describe('TheHeader', () => {
  const mockApi = {
    setRefresh: vi.fn(),
    setAccessToken: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
  }

  const wrapper = mount(TheHeader, {
    shallow: true,
    global: {
      stubs: { 'router-link': RouterLinkStub },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
      provide: {
        api: mockApi,
      },
    },
  })

  it('renders logo', () => {
    expect(wrapper.find('a').text()).toContain('MY MEVN APP')
  })

  const authStore = useAuthStore()

  it('renders menu', async (ctx) => {
    const user = new User(ctx.user).toJSON()
    authStore.currentUser = user

    await flushPromises()

    const filteredRoutesLength = routes.filter(
      (route) => !route.meta.hideInMenu && checkRole(Role.Admin, route.meta.roles),
    ).length

    expect(wrapper.findAll('a')).toHaveLength(filteredRoutesLength + 1)
  })
})
