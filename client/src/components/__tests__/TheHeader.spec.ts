import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import routes from '@/router/routes'

import TheHeader from '../layout/TheHeader.vue'

describe('TheHeader', async () => {
  const wrapper = mount(TheHeader, {
    shallow: true,
    global: {
      stubs: { 'router-link': RouterLinkStub },
    },
  })

  it('renders logo', async () => {
    expect(wrapper.find('a').text()).toContain('MY MEVN APP')
  })

  it('renders menu', async () => {
    const filteredRoutesLength = routes.filter((route) => !route.meta.hideInMenu).length

    expect(wrapper.findAll('a')).toHaveLength(filteredRoutesLength + 1)
  })
})
