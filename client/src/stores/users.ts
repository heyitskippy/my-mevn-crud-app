import type { Ref } from 'vue'

import type { API } from '@/plugins/api'

import type { ID, Maybe } from '_/types'
import type { MakePartial, TMap } from '_/types/utilities'
import type { ToastState } from '_/types/ui'
import type { NullableUserEntity } from '_/types/users'

import { inject, ref, shallowRef } from 'vue'

import { defineStore } from 'pinia'
import { useUiStore } from '@/stores/ui'

import { isObject } from '_/helpers'

import User from '@/models/User'

type List = Ref<TMap<User>>
type ServerEntity = NullableUserEntity

class Model extends User {}

const key = 'user'
const keyPlural = 'users'
const resource = keyPlural

export const useUsersStore = defineStore(resource, () => {
  const api = inject('api') as API
  const ui = useUiStore()

  const items = shallowRef(new Map()) as List

  const itemsAreLoading = ref(false)
  const singleItemIsLoading = ref(false)
  const isDeleting = ref(false)

  async function fetchItems() {
    itemsAreLoading.value = true

    try {
      const data = await api.get<{ [keyPlural]: ServerEntity[] }>(`/${resource}`)

      Model.prepareCollection(data[keyPlural], items.value)
    } catch (e) {
      console.error('[fetchItems]', `/${resource}/\n`, e)
    } finally {
      itemsAreLoading.value = false
    }
  }

  async function fetchItemById(id: ID) {
    singleItemIsLoading.value = true

    try {
      const data = await api.get<{ [key]: ServerEntity }>(`/${resource}/${id}`)

      setItem(data[key])
    } catch (e) {
      console.error('[fetchItemById]', `/${resource}/\n`, e)
    } finally {
      singleItemIsLoading.value = false
    }

    return getItem(id)
  }

  async function addItem(model: Model) {
    const options: Partial<ToastState> = {}
    let id = model.id

    singleItemIsLoading.value = true

    const serialized = model.toJSON()
    const m: MakePartial<NullableUserEntity, 'password'> = { ...model.getModel() }
    if (serialized.password === null) delete m.password

    try {
      const data = await api.post<{ [key]: ServerEntity }>(
        `/${resource}`,
        model.prepare(serialized, m),
      )

      id = data[key].id

      setItem(data[key])
      removeItem(null)

      options.type = 'success'
      options.text = 'Added successfully'
    } catch (e) {
      handleValidationError(e, getItem(null))

      options.text = 'Something went wrong. Failed to add'

      console.error('[addItem]', `/${resource}/\n`, e)
    } finally {
      singleItemIsLoading.value = false

      if (options.text) ui.addToast(options)
    }

    return getItem(id)
  }

  async function updateItem(model: Model) {
    const options: Partial<ToastState> = {}
    const id = model.id

    singleItemIsLoading.value = true

    const serialized = model.toJSON()
    const m: MakePartial<NullableUserEntity, 'password'> = { ...model.getModel() }
    if (serialized.password === null) delete m.password

    try {
      const data = await api.put<{ [key]: ServerEntity }>(
        `/${resource}/${id}`,
        model.prepare(serialized, m),
      )

      setItem(data[key])

      options.type = 'success'
      options.text = 'Updated successfully'
    } catch (e) {
      handleValidationError(e, getItem(id))

      options.text = 'Something went wrong. Failed to save'

      console.error('[updateItem]', `/${resource}/\n`, e)
    } finally {
      singleItemIsLoading.value = false

      if (options.text) ui.addToast(options)
    }

    return getItem(id)
  }

  async function deleteItem(id: ID) {
    const options: Partial<ToastState> = {}

    singleItemIsLoading.value = true

    try {
      const data = await api.delete<{ [key]: ServerEntity }>(`/${resource}/${id}`)

      removeItem(data[key].id)
    } catch (e) {
      options.text = 'Something went wrong. Failed to delete'

      console.error('[deleteItem]', `/${resource}/\n`, e)
    } finally {
      singleItemIsLoading.value = false

      if (options.text) ui.addToast(options)
    }
  }

  async function getItemById(id: Maybe<ID>) {
    if (hasItem(id)) return getItem(id)
    if (id !== null) return fetchItemById(id)

    return undefined
  }

  function setItem(item: ServerEntity) {
    if (hasItem(item.id)) {
      getItem(item.id)?.update(item, true)
    } else {
      createItem(item)
    }
  }

  function hasItem(id: Maybe<ID>) {
    return items.value.has(id)
  }

  function getItem(id: Maybe<ID>) {
    return items.value.get(id)
  }
  /**
   * The result is the same as using the "unshift" method of an array, but with a single item
   */
  function createItem(item: Partial<ServerEntity> = { id: null }) {
    const id = item.id ?? null

    const newItems = new Map()
    newItems.set(id, new Model(item))

    items.value.forEach((model) => newItems.set(model.id, model))

    items.value = newItems

    return getItem(id)
  }

  function removeItem(id: Maybe<ID>) {
    return items.value.delete(id)
  }

  function handleValidationError(e: unknown, user: User | undefined) {
    if (!(isObject(e) && 'cause' in e) || !user) return

    const { cause } = e as { cause: { status: number; errors: object } }
    if (cause.status !== 422) return

    user.updateValidationErrors(cause.errors)
  }

  return {
    users: items,

    usersAreLoading: itemsAreLoading,
    userIsLoading: singleItemIsLoading,

    userIsDeleting: isDeleting,

    fetchUsers: fetchItems,
    fetchUserById: fetchItemById,

    addUser: addItem,
    updateUser: updateItem,
    deleteUser: deleteItem,

    getUserById: getItemById,

    createUser: createItem,
    removeUser: removeItem,
  }
})
