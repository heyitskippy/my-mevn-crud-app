import { describe, it, expect, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'

import routes from '@/router/routes'

import TheHeader from '../layout/TheHeader.vue'

describe('TheHeader', () => {
  const wrapper = mount(TheHeader, {
    shallow: true,
    global: {
      stubs: { 'router-link': RouterLinkStub },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  })

  it('renders logo', () => {
    expect(wrapper.find('a').text()).toContain('MY MEVN APP')
  })

  it('renders menu', () => {
    const filteredRoutesLength = routes.filter((route) => !route.meta.hideInMenu).length

    expect(wrapper.findAll('a')).toHaveLength(filteredRoutesLength + 1)
  })
})
