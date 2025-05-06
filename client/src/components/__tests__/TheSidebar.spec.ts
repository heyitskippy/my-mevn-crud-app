import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useUiStore } from '@/stores/ui'

import routes from '@/router/routes'

import TheSidebar from '../layout/TheSidebar.vue'

describe('TheSidebar', () => {
  document.body.innerHTML = `<div id="app"></div>`

  const app = document.getElementById('app') ?? undefined

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
    },
  })

  const ui = useUiStore()

  it('should render a menu and close when you press Escape', async () => {
    ui.showSidebar = true
    await flushPromises()

    const filteredRoutesLength = routes.filter((route) => !route.meta.hideInMenu).length

    expect(wrapper.findAll('a')).toHaveLength(filteredRoutesLength)

    await wrapper.trigger('keyup', { key: 'Escape' })
    expect(ui.showSidebar).toBe(false)

    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})
