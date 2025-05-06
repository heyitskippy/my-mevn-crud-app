import type { ToastState } from '_/types/ui'

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { cloneDeep } from '_/helpers'

import { DEFAULT_TOASTER_STATE } from '@/constants'

import MyToast from '../MyToaster/MyToast.vue'

describe('MyToast', () => {
  const state: ToastState = {
    key: Symbol(),
    ...cloneDeep(DEFAULT_TOASTER_STATE),
    text: 'Something went wrong',
    visibility: true,
  }

  it('should render the toast and emit the event "update:visibility"', async () => {
    const wrapper = mount(MyToast, {
      props: {
        state,
      },
    })

    expect(wrapper.find('div[role="alert"]').exists()).toBe(true)

    const toast = wrapper.get('div[role="alert"]')

    await toast.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('update:visibility', [[false]])
  })
})
