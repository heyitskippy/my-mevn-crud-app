<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import MyToaster from '@/components/MyToaster/MyToaster.vue'

const authStore = useAuthStore()
const { isLoading } = storeToRefs(authStore)

const ui = useUiStore()
ui.setProgress(isLoading)
</script>

<template>
  <div
    class="min-h-screen font-roboto text-gray-800 bg-gradient-to-r from-50% from-white via-sky-50/70 via-80% to-100% to-amber-50/50 max-w-screen overflow-x-clip"
  >
    <router-view name="header" />
    <router-view name="sidebar" />

    <main class="mx-auto max-w-7xl">
      <router-view />
    </main>

    <MyToaster />
  </div>
</template>
