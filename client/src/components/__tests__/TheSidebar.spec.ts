import { Role } from '_/types/users'

import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import routes from '@/router/routes'
import { checkRole } from '@/router/auth'

import User from '@/models/User'

import TheSidebar from '../layout/TheSidebar.vue'

describe('TheSidebar', () => {
  document.body.innerHTML = `<div id="app"></div>`

  const app = document.getElementById('app') ?? undefined

  const mockApi = {
    setRefresh: vi.fn(),
    setAccessToken: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
  }

  const wrapper = mount(TheSidebar, {
    shallow: true,
    attachTo: app,
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

  const ui = useUiStore()
  const authStore = useAuthStore()

  it('should render a menu and close when you press Escape', async (ctx) => {
    const user = new User(ctx.user).toJSON()

    authStore.currentUser = user
    ui.showSidebar = true

    await flushPromises()

    const filteredRoutesLength = routes.filter(
      (route) => !route.meta.hideInMenu && checkRole(Role.Admin, route.meta.roles),
    ).length

    expect(wrapper.findAll('a')).toHaveLength(filteredRoutesLength)

    await wrapper.trigger('keyup', { key: 'Escape' })
    expect(ui.showSidebar).toBe(false)

    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})
