<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/16/solid'

import MyHeading from '@/components/MyHeading.vue'
import MyBtn from '@/components/MyBtn.vue'

if (history.state[404]) history.replaceState({}, '', history.state[404])
</script>

<template>
  <div class="mb-10">
    <MyHeading>404: not found</MyHeading>
  </div>

  <div class="flex mt-10">
    <MyBtn link="/" class="mx-auto">
      <template #prepend-icon>
        <HomeIcon />
      </template>

      Home page
    </MyBtn>
  </div>
</template>
