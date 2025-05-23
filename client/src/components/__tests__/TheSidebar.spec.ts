import { Role } from '_/types/users'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    {
      name: 'user',
      path: '/user',
      meta: { title: 'User', hideInMenu: false, roles: [Role.User] },
    },
    {
      name: 'login',
      path: '/login',
      meta: { title: 'Login', hideInMenu: true },
    },
  ],
}))

vi.mock('@/router/auth', () => ({
  checkRole: (role: Role, roles: Role[]) => roles.includes(role),
}))

describe('TheSidebar', () => {
  const currentUser = { email: 'test@test.test', role: Role.Admin }
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

  const mountSidebar = (showSidebar = true) => {
    document.body.innerHTML = `<div id="app"></div>`
    const app = document.getElementById('app') ?? undefined

    return mount(TheSidebar, {
      attachTo: app,
      global: {
        stubs: { 'router-link': RouterLinkStub },
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: { currentUser },
              ui: {
                showSidebar,
                storage: { currentUser },
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
            get: vi.fn().mockResolvedValue({ user: currentUser }),
          },
        },
      },
    })
  }

  beforeEach(async () => {
    wrapper = mountSidebar()
    ui = useUiStore()
    await flushPromises()
    await router.isReady()
  })
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should render the menu when showSidebar is true', async () => {
    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.find('.backdrop-blur-sm').exists()).toBe(true)
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

  it('renders the menu with only visible and allowed routes', () => {
    const links = wrapper.findAllComponents(RouterLinkStub)
    const linkTexts = links.map((link) => link.text())

    expect(linkTexts).toContain('Home')
    expect(linkTexts).not.toContain('Login')
    expect(linkTexts).not.toContain('User')
  })

  it('does not render the sidebar or overlay when showSidebar is false', async () => {
    wrapper.unmount()
    wrapper = mountSidebar(false)

    await flushPromises()
    expect(wrapper.find('aside').exists()).toBe(false)
    expect(wrapper.find('.backdrop-blur-sm').exists()).toBe(false)
  })
})
