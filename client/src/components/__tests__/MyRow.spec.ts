import type { NullableUserEntity } from '_/types/users'
import type { TableCellSlots } from '_/types/ui'

import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import { USER_HEADERS } from '@/constants'

import User from '@/models/User'

import { ExclamationCircleIcon } from '@heroicons/vue/16/solid'

import MyRow from '../MyTable/MyRow.vue'

describe('MyRow', () => {
  const headers = USER_HEADERS

  it('should render the item, show the row number and the actions cell', async (ctx) => {
    const index = 0
    const item = new User(
      ctx.fixtures.generateUser<Partial<NullableUserEntity>>({
        updatedAt: new Date().toISOString(),
      }),
    )

    const wrapper = mount(MyRow<typeof item>, {
      props: {
        index,
        item,

        headers,

        showRowNumber: true,
        showActions: true,
      },
    })

    expect(wrapper.classes('green')).toBeTruthy()

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

  it('should emit all events except "delete"', async (ctx) => {
    const index = 0
    const item = new User(ctx.fixtures.generateUser<Partial<NullableUserEntity>>({ id: '🌚' }))

    item.update({ email: 'forgotten-realms@email.su' })
    expect(item.isDirty()).toBe(true)

    await flushPromises()

    const wrapper = mount(MyRow<typeof item>, {
      props: {
        index,
        item,

        headers,

        showActions: true,
      },
    })

    const actionsCell = wrapper.get('.my-table-cell:last-child')

    await actionsCell.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('goTo', [[item.id]])

    await actionsCell.trigger('mouseover')

    let btn = actionsCell.find('[name="save"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    btn = actionsCell.find('[name="softDelete"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    btn = actionsCell.find('[name="reset"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('handleItem', [
      ['save', item],
      ['softDelete', item],
      ['reset', item],
    ])
  })

  it('should emit a "delete" event and not show the exclamation mark icon', async (ctx) => {
    const index = 0
    const item = new User(ctx.fixtures.generateUser<Partial<NullableUserEntity>>({ id: '🌚' }))

    item.delete()

    const wrapper = mount(MyRow<typeof item>, {
      props: {
        index,
        item,

        headers,

        showRowNumber: true,
        showActions: true,
      },
    })

    const actionsCell = wrapper.get('.my-table-cell:last-child')

    await actionsCell.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('goTo', [[item.id]])

    const btn = actionsCell.get('[name="delete"]')
    await btn.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('handleItem', [['delete', item]])

    const numberCell = wrapper.get('.my-table-cell:first-child')
    expect(numberCell.find('svg').exists()).toBe(false)
  })

  it('should show exclamation mark icon', async (ctx) => {
    const index = 0
    const item = new User(
      ctx.fixtures.generateUser<Partial<NullableUserEntity>>({ id: '🌚', email: '' }),
    )

    const wrapper = mount(MyRow<typeof item>, {
      props: {
        index,
        item,

        headers,

        showRowNumber: true,
      },
    })

    const numberCell = wrapper.get('.my-table-cell:first-child')
    expect(numberCell.findComponent(ExclamationCircleIcon).exists()).toBe(true)
  })
})
