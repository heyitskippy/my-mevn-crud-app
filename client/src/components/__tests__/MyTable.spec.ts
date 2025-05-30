import type { NullableUserEntity } from '_/types/users'
import type { Flatten } from '_/types/utilities'
import type { TableCellSlots } from '_/types/ui'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import User from '@/models/User'

import { USER_HEADERS } from '@/constants'

import MyTable from '../MyTable/MyTable.vue'

const addEventListener = vi.fn()
const removeEventListener = vi.fn()

describe('MyTable', () => {
  const headers = USER_HEADERS

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener,
        removeEventListener,
        dispatchEvent: vi.fn(),
      })),
    })
  })

  vi.mock('vue-router', () => ({ onBeforeRouteLeave: vi.fn() }))

  it('renders headers & items', async (ctx) => {
    const items = User.prepareCollection(
      Array.from({ length: 20 }).map<Partial<NullableUserEntity>>((_, index) =>
        ctx.fixtures.generateUser({ id: String(index) }),
      ),
    )

    const wrapper = mount(MyTable, {
      props: {
        headers,
        items,
      },
    })

    const amount = items.size * headers.length
    const cells = wrapper.findAll('[data-test="cell"]')

    expect(cells).toHaveLength(amount)
    expect(cells[0].text()).toContain(items.get('0')?.[headers[0].field])
  })

  it('renders custom slots', async (ctx) => {
    const items = User.prepareCollection(
      Array.from({ length: 20 }).map<Partial<NullableUserEntity>>((_, index) =>
        ctx.fixtures.generateUser({ id: String(index) }),
      ),
    )

    const slots = headers.reduce(
      (acc, header) => {
        acc[header.field] = (props: { item: Flatten<typeof items> }) =>
          `${props.item[header.field]} test`

        return acc
      },
      {} as TableCellSlots<typeof headers>,
    )

    const wrapper = mount(MyTable, {
      props: {
        headers,
        items,
      },
      slots,
    })

    const cells = wrapper.findAll('[data-test="cell"]')
    const field = items.get('0')?.[headers[0].field]

    expect(cells[0].text()).toContain(`${field} test`)
  })

  it('calls handleHovering via lifecycle and cleans up', async (ctx) => {
    const fakeMql = {
      matches: true,
      addEventListener,
      removeEventListener,
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(fakeMql))

    const items = User.prepareCollection([ctx.fixtures.generateUser({ id: '1' })])
    const wrapper = mount(MyTable, {
      props: {
        headers: USER_HEADERS,
        items,
        showActions: true,
      },
    })

    // @ts-expect-error: actionsVisibility is not public
    expect(wrapper.vm.actionsVisibility).toBe(true)

    wrapper.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should hide actions when media query does not match', async (ctx) => {
    const items = User.prepareCollection([ctx.fixtures.generateUser({ id: '1' })])
    const wrapper = mount(MyTable, {
      props: {
        headers: USER_HEADERS,
        items,
        showActions: true,
      },
    })

    // @ts-expect-error: actionsVisibility
    expect(wrapper.vm.actionsVisibility).toBe(false)

    wrapper.unmount()

    expect(removeEventListener).toHaveBeenCalled()
  })
})
