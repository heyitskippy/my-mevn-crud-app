<script setup lang="ts">
import type { ID, Maybe } from '_/types'
import type { BtnAction } from '_/types/ui'
import type User from '@/models/User'

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'

import { useRerenderHack } from '@/composables/useRerenderHack'

import { USER_HEADERS } from '@/constants'

import { CloudArrowUpIcon, PlusCircleIcon } from '@heroicons/vue/16/solid'

import MyHeading from '@/components/MyHeading.vue'
import MyTable from '@/components/MyTable/MyTable.vue'
import MyBtn from '@/components/MyBtn.vue'

const usersStore = useUsersStore()
const { users, usersAreLoading, userIsDeleting, userIsLoading } = storeToRefs(usersStore)

const isLoading = computed(
  () => usersAreLoading.value || userIsDeleting.value || userIsLoading.value,
)

const ui = useUiStore()
ui.setProgress(isLoading)

const rerender = useRerenderHack(isLoading)
const { rerenderKey } = rerender

const title = 'Users'
const headers = USER_HEADERS

onMounted(async () => {
  if (users.value.size <= 1) await usersStore.fetchUsers()
})

const router = useRouter()
function goTo(id: Maybe<ID>) {
  router.push({ name: 'users-edit', params: { id } })
}

async function handleItem(action: BtnAction, item: User | undefined) {
  if (!item) return

  if (action === 'reset') item.reset()
  if (action === 'softDelete') {
    if (item.isNew()) {
      usersStore.removeUser(item.id)
      rerender.iterateKey()
    } else item.delete()
  }
  if (action === 'delete') await remove(item.id)
  if (action === 'save') await save(item)
}
/**
 * Confirm changes: save to the server
 */
async function confirm() {
  const promises: Promise<void>[] = []

  users.value.forEach((user) => {
    if (user.isDeleted) promises.push(handleItem('delete', user))
    else if (user.isValid() && (user.isNew() || user.isDirty())) {
      promises.push(handleItem('save', user))
    }
  })

  await Promise.allSettled(promises)
}

async function save(item: User) {
  if (item.isNew()) await usersStore.addUser(item)
  else await usersStore.updateUser(item)
}

async function remove(id: Maybe<ID>) {
  if (id === null) {
    usersStore.removeUser(null)
    rerender.iterateKey()
  } else await usersStore.deleteUser(id)
}
</script>

<template>
  <div class="flex justify-between mb-10">
    <MyHeading>{{ title }}</MyHeading>

    <div class="flex self-end ml-4 mb-4">
      <MyBtn :link="{ name: 'users-edit' }" title="Create new user" name="create">
        <template #prepend-icon>
          <PlusCircleIcon />
        </template>

        Create
      </MyBtn>

      <MyBtn
        secondary
        class="ml-4"
        title="Confirm changes: save to the server"
        name="confirm"
        @click="confirm"
      >
        <template #prepend-icon>
          <CloudArrowUpIcon />
        </template>

        Confirm
      </MyBtn>
    </div>
  </div>

  <MyTable
    :key="rerenderKey"
    :headers="headers"
    :items="users"
    show-actions
    show-row-number
    @go-to="goTo"
    @handle-item="handleItem"
  />
</template>
