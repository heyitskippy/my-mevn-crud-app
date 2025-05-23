import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import MyBtn from '../MyBtn.vue'

describe('MyBtn', () => {
  const TEXT = 'Click!'

  it('renders, clickable, not disabled', async () => {
    const wrapper = mount(MyBtn, {
      props: {
        secondary: true,
      },
      slots: {
        default: TEXT,
      },
      shallow: true,
      global: {
        stubs: { 'router-link': RouterLinkStub },
      },
    })

    const span = wrapper.get('span')
    expect(span.text() === TEXT).toBeTruthy()

    const btn = wrapper.get('button')
    expect(btn.classes('primary')).toBeFalsy()
    expect(btn.classes('secondary')).toBeTruthy()

    expect(btn.attributes('disabled')).toBe(undefined)

    await btn.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('can be disabled', async () => {
    const wrapper = mount(MyBtn, {
      props: {
        disabled: true,
      },
      slots: {
        default: TEXT,
      },
      shallow: true,
      global: {
        stubs: { 'router-link': RouterLinkStub },
      },
    })

    const btn = wrapper.get('button')

    expect(btn.attributes('disabled')).toBe('')

    await btn.trigger('click')
    expect(wrapper.emitted()).not.toHaveProperty('click')
  })

  it('renders prepend-icon slot', () => {
    const wrapper = mount(MyBtn, {
      slots: {
        'prepend-icon': '<svg class="test-prepend" />',
        default: 'With Icon',
      },
      shallow: true,
    })
    expect(wrapper.find('.mr-2 .test-prepend').exists()).toBe(true)
  })

  it('renders append-icon slot', () => {
    const wrapper = mount(MyBtn, {
      slots: {
        'append-icon': '<svg class="test-append" />',
        default: 'With Icon',
      },
      shallow: true,
    })

    expect(wrapper.find('.ml-2 .test-append').exists()).toBe(true)
  })

  it('renders as icon button when btnIcon is true', () => {
    const wrapper = mount(MyBtn, {
      props: { btnIcon: true },
      slots: {
        default: '<svg class="icon-content" />',
      },
      shallow: true,
    })

    expect(wrapper.find('.my-btn').classes()).toContain('btn-icon')
    expect(wrapper.find('.icon-content').exists()).toBe(true)
  })
})
