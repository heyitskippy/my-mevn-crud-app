/* eslint-disable  @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import * as helpers from '_/helpers'

import MyInput from '../MyInput.vue'

describe('MyInput', () => {
  const TEXT1 = 'test1'
  const TEXT2 = 'test2'

  it('should update "modelValue", emit the event "update:modelValue"', async () => {
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

  it('should show an error message', async () => {
    const validation = 'Error!'

    const wrapper = mount(MyInput, {
      props: {
        modelValue: null,
        name: TEXT1,
        label: TEXT1,
      },
    })

    expect(wrapper.find('[data-test="error"]').exists()).toBe(false)

    await wrapper.setProps({ validation })

    const error = wrapper.find('[data-test="error"]')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe(validation)
  })

  it('should prepare date', async () => {
    const date = '2025-02-26T14:31:20.451Z'
    const prepared = '2025-02-26T17:31:20.451'

    const wrapper = mount(MyInput, {
      props: {
        modelValue: date,
        name: TEXT1,
        label: TEXT1,
        type: 'datetime-local',
      },
    })

    const input = wrapper.get('input')
    expect(input.element.value).toBe(prepared)
  })

  it('should return empty string if prepareDateValue gets invalid date', async () => {
    const wrapper = mount(MyInput, {
      props: {
        modelValue: 'invalid-date',
        name: 'date',
        label: 'Date',
        type: 'datetime-local',
      },
    })

    vi.spyOn(helpers, 'fixTimezoneOffset').mockReturnValueOnce({ toJSON: () => undefined } as any)

    const input = wrapper.get('input')
    expect(input.element.value).toBe('')
  })
})
