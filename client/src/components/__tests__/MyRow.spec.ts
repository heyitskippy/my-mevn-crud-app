import type { NullableUserEntity } from '_/types/users'
import type { TableCellSlots } from '_/types/ui'

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { USER_HEADERS } from '@/constants'

import User from '@/models/User'

import MyRow from '../MyTable/MyRow.vue'

describe('MyRow', () => {
  const headers = USER_HEADERS

  it('should render the item, show the row number and the actions cell', async (ctx) => {
    const index = 0
    const item = new User(ctx.fixtures.generateUser<Partial<NullableUserEntity>>())

    const wrapper = mount(MyRow<typeof item>, {
      props: {
        index,
        item,

        headers,

        showRowNumber: true,
        showActions: true,
      },
    })

    const cells = wrapper.findAll('[data-test="cell"]')
    let amount = headers.length

    expect(cells).toHaveLength(amount)
    expect(cells[0].text()).toContain(item[headers[0].field])

    const numberCell = wrapper.find('.my-table-cell')
    expect(numberCell.text()).toBe(`${index + 1}`)

    amount = headers.length + 2 // + numberCell & actionsCell

    const actionsCell = wrapper.findAll('.my-table-cell')[amount - 1]
    expect(actionsCell.html()).toContain('</svg>')
  })

  it('should render custom slots and not show the row number', async (ctx) => {
    const index = 0
    const item = new User(ctx.fixtures.generateUser<Partial<NullableUserEntity>>())

    const slots = headers.reduce(
      (acc, header) => {
        acc[header.field] = (props: { item: typeof item }) => `${props.item[header.field]} test`

        return acc
      },
      {} as TableCellSlots<typeof headers>,
    )

    const wrapper = mount(MyRow, {
      props: {
        index,
        item,

        headers,
      },
      slots,
    })

    const cells = wrapper.findAll('[data-test="cell"]')
    expect(cells[0].text()).toContain(`${item[headers[0].field]} test`)

    const numberCell = wrapper.find('.my-table-cell')
    expect(numberCell.text()).not.toBe(`${index + 1}`)
  })
})
