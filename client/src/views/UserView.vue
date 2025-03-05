<script setup lang="ts">
import { generateUser } from '_/tests/fixtures'

import { USER_HEADERS } from '@/constants'

import MyHeading from '@/components/MyHeading.vue'
import MyTable from '@/components/MyTable.vue'

const headers = USER_HEADERS
const items = Array.from({ length: 20 }).map(() => generateUser())
</script>

<template>
  <MyHeading>Users</MyHeading>

  <MyTable :headers="headers" :items="items" actions />
</template>
