import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import MyHeading from '@/components/MyHeading.vue'

describe('MyHeading', () => {
  const TEXT = 'Heading'

  it('renders', async () => {
    const wrapper = mount(MyHeading, {
      slots: {
        default: TEXT,
      },
    })

    await flushPromises()

    const heading = wrapper.get('h1')
    expect(heading.text() === TEXT).toBeTruthy()
  })
})
