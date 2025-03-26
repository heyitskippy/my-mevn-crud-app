<script setup lang="ts">
import type { ID, Maybe } from '_/types'

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'

import { USER_HEADERS } from '@/constants'

import MyHeading from '@/components/MyHeading.vue'
import MyTable from '@/components/MyTable/MyTable.vue'
import MyBtn from '@/components/MyBtn.vue'

const ui = useUiStore()
const usersStore = useUsersStore()

const { users, usersAreLoading } = storeToRefs(usersStore)

ui.setProgress(usersAreLoading)

const title = 'Users'
const headers = USER_HEADERS

onMounted(async () => {
  if (users.value.size <= 1) await usersStore.fetchUsers()
})

const router = useRouter()
function goTo(id: Maybe<ID>) {
  router.push({ name: 'users-edit', params: { id } })
}
</script>

<template>
  <div class="flex justify-between mb-10">
    <MyHeading>{{ title }}</MyHeading>

    <div class="flex self-end ml-4 mb-4">
      <MyBtn :link="{ name: 'users-edit' }">Create</MyBtn>

      <MyBtn secondary class="ml-4">Save to server</MyBtn>
    </div>
  </div>

  <MyTable
    :key="+usersAreLoading"
    :headers="headers"
    :items="users"
    show-actions
    show-row-number
    @go-to="goTo"
  />
</template>
