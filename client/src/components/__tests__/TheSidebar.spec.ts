import { Role } from '_/types/users'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useUiStore } from '@/stores/ui'

import { createRouter, createWebHistory } from 'vue-router'

import TheSidebar from '../layout/TheSidebar.vue'

vi.mock('@/router/routes', () => ({
  default: [
    {
      name: 'home',
      path: '/',
      meta: { title: 'Home', hideInMenu: false, roles: [Role.Admin] },
    },
  ],
}))
vi.mock('@/router/auth', () => ({
  checkRole: () => true,
}))

describe('TheSidebar', () => {
  const currentUser = { email: 'test@test.test', role: Role.Admin }
  const accessToken = 'test-token'
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        name: 'home',
        path: '/',
        component: { template: '<div>Home</div>' },
      },
    ],
  })
  let ui: ReturnType<typeof useUiStore>
  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    document.body.innerHTML = `<div id="app"></div>`
    const app = document.getElementById('app') ?? undefined

    wrapper = mount(TheSidebar, {
      shallow: true,
      attachTo: app,
      global: {
        stubs: { 'router-link': RouterLinkStub },
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                currentUser,
                currentRole: Role.Admin,
              },
              ui: {
                showSidebar: true,
                storage: {
                  currentUser,
                  accessToken,
                },
              },
            },
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        provide: {
          api: {
            setRefresh: vi.fn(),
            setAccessToken: vi.fn(),
            get: vi.fn().mockResolvedValue({ user: currentUser, accessToken }),
          },
        },
      },
    })

    ui = useUiStore()

    await router.isReady()
  })

  it('should render the menu when showSidebar is true', async () => {
    await flushPromises()
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('should close sidebar on Escape key press', async () => {
    await wrapper.trigger('keyup', { key: 'Escape' })
    expect(ui.showSidebar).toBe(false)
  })

  it('should close sidebar when overlay is clicked', async () => {
    const overlay = wrapper.find('.backdrop-blur-sm')
    expect(overlay.exists()).toBe(true)

    await overlay.trigger('click.self')
    expect(ui.showSidebar).toBe(false)
  })
})
