import type { NullableUserEntity } from '_/types/users'
import type { Flatten } from '_/types/utilities'
import type { TableCellSlots } from '_/types/ui'

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import User from '@/models/User'

import { USER_HEADERS } from '@/constants'

import MyTable from '../MyTable/MyTable.vue'

describe('MyTable', () => {
  const headers = USER_HEADERS

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
})
