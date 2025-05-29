<script setup lang="ts">
import type { RouteMeta } from 'vue-router'

import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import routes from '@/router/routes'
import { checkRole } from '@/router/auth'

import MyBtn from '@/components/MyBtn.vue'

import { Bars3Icon } from '@heroicons/vue/24/solid'
import { ArrowRightEndOnRectangleIcon, UserCircleIcon } from '@heroicons/vue/16/solid'

const { showSidebar } = storeToRefs(useUiStore())

const authStore = useAuthStore()
const { currentRole, currentUser } = storeToRefs(authStore)

const menu = computed(() =>
  routes.map(
    (routeItem) =>
      ({
        name: routeItem.name,
        title: routeItem.meta?.title ?? '',
        hideInMenu: routeItem.meta?.hideInMenu ?? false,
        roles: routeItem.meta?.roles ?? [],
      }) satisfies Required<RouteMeta>,
  ),
)
</script>

<template>
  <div
    class="sticky top-0 z-[41] border border-gray-100 bg-white/70 shadow-xl shadow-sky-50 backdrop-blur-sm"
  >
    <header class="flex items-center max-w-7xl px-5 lg:px-10 mx-auto">
      <MyBtn btn-icon class="md:hidden mr-3" aria-label="Menu" @click="showSidebar = !showSidebar">
        <Bars3Icon class="!size-5" />
      </MyBtn>

      <router-link
        class="mr-5 lg:mr-10 block text-4xl lg:text-5xl font-extralight tracking-tight uppercase subpixel-antialiased no-underline whitespace-nowrap text-transparent bg-clip-text bg-radial-[at_50%_75%] from-sky-100 via-pink-600 to-sky-500 to-90%"
        to="/"
      >
        MY MEVN APP
      </router-link>

      <nav class="hidden md:flex gap-4 text-sm lg:text-base">
        <template v-for="item in menu" :key="item.name">
          <router-link
            v-if="!item.hideInMenu && checkRole(currentRole, item.roles)"
            :to="{ name: item.name }"
          >
            {{ item.title }}
          </router-link>
        </template>
      </nav>

      <template v-if="currentUser">
        <div class="flex items-center gap-2 ml-auto">
          <UserCircleIcon
            class="hidden md:block size-3.5 lg:size-4 text-sky-400"
            data-test="user"
          />

          <div class="hidden md:block text-sm lg:text-base">
            {{ currentUser.email }}
          </div>

          <MyBtn
            title="Logout"
            btn-icon
            aria-label="Logout"
            data-test="logout"
            @click="authStore.logout"
          >
            <ArrowRightEndOnRectangleIcon />
          </MyBtn>
        </div>
      </template>
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
