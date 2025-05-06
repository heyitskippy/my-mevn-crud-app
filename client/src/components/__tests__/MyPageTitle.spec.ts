import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyPageTitle from '../MyPageTitle.vue'

describe('MyPageTitle', () => {
  const title = 'title'
  const actions = 'actions'

  it('should render slots', () => {
    const wrapper = mount(MyPageTitle, {
      slots: {
        title,
        actions: `<p>${actions}</p>`,
      },
    })

    const h1 = wrapper.get('h1')
    expect(h1.text()).toContain(title)

    const p = wrapper.get('p')
    expect(p.text()).toContain(actions)
  })
})
