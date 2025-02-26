import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyBtn from '../MyBtn.vue'

describe('MyBtn', () => {
  const TEXT = 'Click!'

  it('renders, clickable', async () => {
    const wrapper = mount(MyBtn, {
      props: {
        secondary: true,
      },
      slots: {
        default: TEXT,
      },
    })

    const span = wrapper.get('span')
    expect(span.text() === TEXT).toBeTruthy()

    const btn = wrapper.get('button')
    expect(btn.classes('primary')).toBeFalsy()
    expect(btn.classes('secondary')).toBeTruthy()

    await btn.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
