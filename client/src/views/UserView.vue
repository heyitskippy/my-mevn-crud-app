<script setup lang="ts">
import { onMounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'

import { USER_HEADERS } from '@/constants'

import MyHeading from '@/components/MyHeading.vue'
import MyTable from '@/components/MyTable.vue'

const ui = useUiStore()
const usersStore = useUsersStore()

const { users, usersAreLoading } = storeToRefs(usersStore)

ui.setProgress(usersAreLoading)

const title = 'Users'
const headers = USER_HEADERS

onMounted(async () => {
  await usersStore.fetchUsers()
})
</script>

<template>
  <MyHeading>{{ title }}</MyHeading>

  <MyTable :headers="headers" :items="users" show-actions show-row-number />
</template>
