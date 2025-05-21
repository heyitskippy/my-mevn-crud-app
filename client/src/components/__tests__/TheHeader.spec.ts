import { Role } from '_/types/users'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'

import { createRouter, createWebHistory } from 'vue-router'

import TheHeader from '../layout/TheHeader.vue'

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

describe('TheHeader', () => {
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

  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    wrapper = mount(TheHeader, {
      shallow: true,
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

    await router.isReady()
  })

  it('renders logo', () => {
    expect(wrapper.find('a').text()).toContain('MY MEVN APP')
  })

  it('renders menu with visible routes', () => {
    expect(wrapper.findAll('a')).toHaveLength(2) // 1 for logo + 1 route
  })

  it('renders Logout button when user is logged in', () => {
    expect(wrapper.text()).toContain(currentUser.email)
    expect(wrapper.find('[aria-label="Logout"]').exists()).toBe(true)
  })
})
