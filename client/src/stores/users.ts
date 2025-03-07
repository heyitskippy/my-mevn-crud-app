import type { Ref } from 'vue'
import type { ID, Maybe } from '_/types'
import type { TMap } from '_/types/utilities'
import type { IAPI } from '_/types/api'
import type { NullableUserEntity } from '_/types/users'

import { inject, ref } from 'vue'
import { defineStore } from 'pinia'

import User from '@/models/User'

type List = Ref<TMap<User>>
type ServerEntity = NullableUserEntity

class Model extends User {}

const key = 'user'
const keyPlural = 'users'
const resource = keyPlural

export const useUsersStore = defineStore(resource, () => {
  const api = inject('api') as IAPI

  const items = ref(new Map()) as List

  const itemsAreLoading = ref(false)
  const singleItemIsLoading = ref(false)
  const isDeleting = ref(false)

  async function fetchItems() {
    itemsAreLoading.value = true

    try {
      const data = await api.get<{ [keyPlural]: ServerEntity[] }>(`/${resource}`)

      Model.prepareCollection(data[keyPlural], items.value)
    } catch (e) {
      console.error('[fetchItems]', resource, e)
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
      console.error('[fetchItemById]', resource, e)
    } finally {
      singleItemIsLoading.value = false
    }

    return getItem(id)
  }

  async function addItem(model: Model) {
    let id = model.id
    singleItemIsLoading.value = true

    try {
      const data = await api.post<{ [key]: ServerEntity }>(`/${resource}`, model.toJSON())

      id = data[key].id

      setItem(data[key])
    } catch (e) {
      console.error('[addItem]', resource, e)
    } finally {
      singleItemIsLoading.value = false
    }

    return getItem(id)
  }

  async function updateItem(model: Model) {
    const id = model.id

    singleItemIsLoading.value = true

    try {
      const data = await api.put<{ [key]: ServerEntity }>(`/${resource}/${id}`, model.toJSON())

      setItem(data[key])
    } catch (e) {
      console.error('[updateItem]', resource, e)
    } finally {
      singleItemIsLoading.value = false
    }

    return getItem(id)
  }

  async function deleteItem(id: ID) {
    singleItemIsLoading.value = true

    try {
      const data = await api.delete<{ [key]: ServerEntity }>(`/${resource}/${id}`)

      removeItem(data[key].id)
    } catch (e) {
      console.error('[deleteItem]', resource, e)
    } finally {
      singleItemIsLoading.value = false
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

  function createItem(item: ServerEntity) {
    return items.value.set(item.id, new Model(item))
  }

  function removeItem(id: Maybe<ID>) {
    return items.value.delete(id)
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
  }
})
