import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MySelect from '../MySelect.vue'

describe('MySelect', () => {
  const TEXT1 = 'test1'

  const options = Array.from({ length: 20 }).map((_, index) => ({
    id: String(index),
    name: `Пункт ${index}`,
  }))

  it('should be clickable and openable', async () => {
    const wrapper = mount(MySelect, {
      props: {
        modelValue: null,
        name: TEXT1,
        label: TEXT1,
        options,
      },
    })

    const selected = wrapper.get('.select')

    const items = wrapper.get('.items')
    expect(items.classes('hidden')).toBeTruthy()

    await selected.trigger('click')
    expect(items.classes('hidden')).toBeFalsy()

    const option = items.find('div')
    expect(option.text()).toBe(options[0].name)

    await option.trigger('click')
    expect(items.classes('hidden')).toBeTruthy()
  })

  it('should update "modelValue" and the current selected text, emit the event "update:modelValue"', async () => {
    const id = options[1].id
    const name = options[1].name

    const wrapper = mount(MySelect, {
      props: {
        modelValue: null,
        name: TEXT1,
        label: TEXT1,
        options,
        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
      },
    })

    const selected = wrapper.get('.select')
    const items = wrapper.get('.items')

    await selected.trigger('click')

    const option = items.findAll('div')[1]
    expect(option.text()).toBe(name)

    await option.trigger('click')

    const current = selected.get('div')
    expect(current.text()).toBe(name)

    expect(wrapper.props('modelValue')).toBe(id)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue', [[id]])
  })
})
