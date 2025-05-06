import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyHeading from '@/components/MyHeading.vue'

describe('MyHeading', () => {
  const TEXT = 'Heading'

  it('renders', () => {
    const wrapper = mount(MyHeading, {
      slots: {
        default: TEXT,
      },
    })

    const heading = wrapper.get('h1')
    expect(heading.text() === TEXT).toBeTruthy()
  })
})
