import type { Maybe } from '_/types'
import { Role } from '_/types/users'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'

import { createRouter, createWebHistory } from 'vue-router'

import TheHeader from '../layout/TheHeader.vue'

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

describe('TheHeader', () => {
  const user = { email: 'test@test.test', role: Role.Admin }

  let router: ReturnType<typeof createRouter>
  let wrapper: ReturnType<typeof mount>

  const mountHeader = (currentUser: Maybe<typeof user> = user) =>
    mount(TheHeader, {
      global: {
        stubs: { 'router-link': RouterLinkStub },
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                currentUser,
              },
              ui: {
                storage: {
                  currentUser,
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
            get: vi.fn().mockResolvedValue({ user: currentUser }),
          },
        },
      },
    })

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { name: 'home', path: '/', component: { template: '<div>Home</div>' } },
        { name: 'user', path: '/user', component: { template: '<div>User</div>' } },
        { name: 'login', path: '/login', component: { template: '<div>Login</div>' } },
      ],
    })
    wrapper = mountHeader()
    await flushPromises()
    await router.isReady()
  })
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('renders logo', () => {
    expect(wrapper.find('a').text()).toContain('MY MEVN APP')
  })

  it('renders the menu with only visible and allowed routes', () => {
    const links = wrapper.findAllComponents(RouterLinkStub)
    const linkTexts = links.map((link) => link.text())

    expect(linkTexts).toContain('Home')
    expect(linkTexts).not.toContain('Login')
    expect(linkTexts).not.toContain('User')
  })

  it('renders the logout button and user email when the user is logged in', () => {
    expect(wrapper.text()).toContain(user.email)
    expect(wrapper.find('[aria-label="Logout"]').exists()).toBe(true)
  })

  it('calls logout when the logout button is clicked', async () => {
    const authStore = useAuthStore()
    const logoutSpy = vi.spyOn(authStore, 'logout')

    const btn = wrapper.find('[aria-label="Logout"]')
    await btn.trigger('click')
    expect(logoutSpy).toHaveBeenCalled()
  })

  it('does not render user info or logout button when the user is not logged in', async () => {
    wrapper.unmount()
    wrapper = mountHeader(null)

    await flushPromises()
    await router.isReady()

    expect(wrapper.find('[aria-label="Logout"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain(user.email)
    expect(wrapper.find('[data-test="user"]').exists()).toBe(false)
  })
})
