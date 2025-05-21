import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { useUiStore } from '@/stores/ui'

import { TOAST_SIMULTANEOUS } from '@/constants'

import MyToaster from '../MyToaster/MyToaster.vue'

describe('MyToaster', () => {
  const timeout = 300
  const waitBeforeDeleting = 300

  vi.useFakeTimers()

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

  it('should work with the queue, render toasts and remove them', async () => {
    expect(wrapper.find('div[role="alert"]').exists()).toBe(false)

    ui.addToast({ timeout })

    expect(ui.toasterQueue).toHaveLength(1)

    expect(wrapper.find('div[role="alert"]').exists()).toBe(false)

    ui.addToast({ timeout })

    expect(ui.toasterQueue).toHaveLength(2)

    ui.addToast({ timeout })

    expect(ui.toasterQueue).toHaveLength(3)

    ui.addToast({ timeout })

    expect(ui.toasterQueue).toHaveLength(4)
    expect(ui.toasterQueue.every((toast) => !toast.visibility)).toBe(true)

    await vi.advanceTimersByTimeAsync(0)

    expect(wrapper.find('div[role="alert"]').exists()).toBe(true)

    expect(wrapper.findAll('div[role="alert"]')).toHaveLength(TOAST_SIMULTANEOUS)
    expect(ui.toasterQueue.toSpliced(TOAST_SIMULTANEOUS).every((toast) => toast.visibility)).toBe(
      true,
    )

    await vi.advanceTimersByTimeAsync(timeout + waitBeforeDeleting)

    const all = wrapper.findAll('div[role="alert"]')
    expect(all).toHaveLength(1)
    expect(ui.toasterQueue.every((toast) => toast.visibility)).toBe(true)

    await vi.advanceTimersByTimeAsync(timeout + waitBeforeDeleting + 30)

    expect(wrapper.find('div[role="alert"]').exists()).toBe(false)
  })
})
