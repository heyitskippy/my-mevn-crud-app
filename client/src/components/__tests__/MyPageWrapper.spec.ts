import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyPageWrapper from '../MyPageWrapper.vue'

describe('MyPageWrapper', () => {
  it('renders slot content', () => {
    const wrapper = mount(MyPageWrapper, {
      slots: {
        default: '<div class="test-slot">Hello</div>',
      },
    })

    expect(wrapper.text()).toContain('Hello')
  })
})
