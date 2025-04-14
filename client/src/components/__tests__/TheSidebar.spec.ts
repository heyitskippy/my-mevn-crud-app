import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useUiStore } from '@/stores/ui'

import routes from '@/router/routes'

import TheSidebar from '../layout/TheSidebar.vue'

describe('TheSidebar', async () => {
  const wrapper = mount(TheSidebar, {
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

  const ui = useUiStore()

  it('renders menu', async () => {
    ui.showSidebar = true
    await flushPromises()

    const filteredRoutesLength = routes.filter((route) => !route.meta.hideInMenu).length

    expect(wrapper.findAll('a')).toHaveLength(filteredRoutesLength)

    ui.showSidebar = false
    await flushPromises()

    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})
