import type { ToastState } from '_/types/ui'

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useUiStore } from '@/stores/ui'

import { sleep } from '_/helpers'

import { TOAST_SIMULTANEOUS } from '@/constants'

import MyToaster from '../MyToaster/MyToaster.vue'

describe('MyToaster', async () => {
  const wrapper = mount(MyToaster, {
    global: {
      plugins: [
        createTestingPinia({
          stubActions: false,
          createSpy: vi.fn,
        }),
      ],
    },
  })

  const ui = useUiStore()
  const timeout = 300
  const waitBeforeDeleting = 300

  it(
    'should work with the queue, render toasts and remove them',
    async () => {
      expect(wrapper.find('div[role="alert"]').exists()).toBe(false)

      let options: Partial<ToastState> = { type: 'success', text: 'Added successfully', timeout }
      ui.addToast(options)

      expect(ui.toasterQueue).toHaveLength(1)

      expect(wrapper.find('div[role="alert"]').exists()).toBe(false)

      options = { ...options, text: 'Added successfully again' }
      ui.addToast(options)

      expect(ui.toasterQueue).toHaveLength(2)

      options = { ...options, text: 'Added successfully again and again' }
      ui.addToast(options)

      expect(ui.toasterQueue).toHaveLength(3)

      options = { ...options, type: 'error', text: 'Something went wrong. Failed to add' }
      ui.addToast(options)

      expect(ui.toasterQueue).toHaveLength(4)
      expect(ui.toasterQueue.every((toast) => !toast.visibility)).toBe(true)

      await sleep(0)

      expect(wrapper.find('div[role="alert"]').exists()).toBe(true)

      expect(wrapper.findAll('div[role="alert"]')).toHaveLength(TOAST_SIMULTANEOUS)
      expect(ui.toasterQueue.toSpliced(TOAST_SIMULTANEOUS).every((toast) => toast.visibility)).toBe(
        true,
      )

      await sleep(timeout + waitBeforeDeleting)

      const all = wrapper.findAll('div[role="alert"]')
      expect(all).toHaveLength(1)
      expect(ui.toasterQueue.every((toast) => toast.visibility)).toBe(true)

      await sleep(timeout + waitBeforeDeleting + 30)

      expect(wrapper.find('div[role="alert"]').exists()).toBe(false)
    },
    timeout * 2 + waitBeforeDeleting * 2 + 150,
  )
})
