<script setup lang="ts">
import type { RouteMeta } from 'vue-router'

import { computed } from 'vue'

import routes from '@/router/routes'

const menu = computed(() =>
  routes.map(
    (routeItem) =>
      ({
        name: routeItem.name,
        title: routeItem.meta?.title ?? '',
        hideInMenu: routeItem.meta?.hideInMenu ?? false,
      }) satisfies Required<RouteMeta>,
  ),
)
</script>

<template>
  <div
    class="sticky top-0 z-[41] border border-gray-100 bg-white/70 shadow-xl shadow-sky-50 backdrop-blur-sm"
  >
    <header class="flex items-center max-w-7xl px-5 lg:px-10 mx-auto">
      <router-link
        class="mr-5 lg:mr-10 block text-4xl lg:text-5xl font-extralight tracking-tight uppercase subpixel-antialiased no-underline whitespace-nowrap text-transparent bg-clip-text bg-radial-[at_50%_75%] from-sky-100 via-pink-600 to-sky-500 to-90%"
        to="/"
      >
        MY MEVN APP
      </router-link>

      <nav class="flex gap-4 text-sm lg:text-base">
        <template v-for="item in menu" :key="item.name">
          <router-link v-if="!item.hideInMenu" :to="{ name: item.name }">
            {{ item.title }}
          </router-link>
        </template>
      </nav>
    </header>
  </div>
</template>

<style scoped>
header {
  height: var(--header-height);

  @media only screen and (width >= 64rem) {
    height: var(--header-height-lg);
  }
}

nav a {
  @apply no-underline hover:underline;
}
</style>
