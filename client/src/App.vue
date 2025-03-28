<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
/**
 * Kick-start
 */
useUiStore()
</script>

<template>
  <div class="min-h-screen font-roboto text-gray-800 bg-white">
    <router-view name="header" />

    <main
      class="mx-auto my-10 max-w-7xl rounded-lg border border-gray-100 bg-white p-10 shadow-xl shadow-sky-50"
    >
      <router-view />
    </main>
  </div>
</template>
