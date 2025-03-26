import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import MyBtn from '../MyBtn.vue'

describe('MyBtn', () => {
  const TEXT = 'Click!'

  it('renders, clickable, not disabled', async () => {
    const wrapper = mount(MyBtn, {
      props: {
        secondary: true,
      },
      slots: {
        default: TEXT,
      },
      shallow: true,
      global: {
        stubs: { 'router-link': RouterLinkStub },
      },
    })

    const span = wrapper.get('span')
    expect(span.text() === TEXT).toBeTruthy()

    const btn = wrapper.get('button')
    expect(btn.classes('primary')).toBeFalsy()
    expect(btn.classes('secondary')).toBeTruthy()

    expect(btn.attributes('disabled')).toBe(undefined)

    await btn.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('can be disabled', async () => {
    const wrapper = mount(MyBtn, {
      props: {
        disabled: true,
      },
      slots: {
        default: TEXT,
      },
      shallow: true,
      global: {
        stubs: { 'router-link': RouterLinkStub },
      },
    })

    const btn = wrapper.get('button')

    expect(btn.attributes('disabled')).toBe('')

    await btn.trigger('click')
    expect(wrapper.emitted()).not.toHaveProperty('click')
  })
})
