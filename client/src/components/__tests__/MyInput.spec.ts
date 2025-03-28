import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyInput from '../MyInput.vue'

describe('MyInput', () => {
  it('should update "modelValue", emit the event "update:modelValue"', async () => {
    const TEXT1 = 'test1'
    const TEXT2 = 'test2'

    const wrapper = mount(MyInput, {
      props: {
        modelValue: TEXT1,
        name: TEXT1,
        label: TEXT1,
      },
    })

    const input = wrapper.get('input')
    expect(input.element.value).toBe(TEXT1)

    await input.setValue(TEXT2)

    expect(input.element.value).toBe(TEXT2)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue', [[TEXT2]])
  })
})
