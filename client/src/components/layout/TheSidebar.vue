<script setup lang="ts">
import type { RouteMeta } from 'vue-router'

import { computed, onMounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import routes from '@/router/routes'
import { checkRole } from '@/router/auth'

import MyBtn from '@/components/MyBtn.vue'

import { Bars3Icon } from '@heroicons/vue/24/solid'

const { showSidebar: show } = storeToRefs(useUiStore())

const authStore = useAuthStore()
const { currentRole } = storeToRefs(authStore)

onMounted(() => {
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') close()
  })
})

function close() {
  show.value = false
}

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
  <transition name="slide-fade">
    <aside
      v-if="show"
      class="fixed md:hidden top-0 left-0 z-50 h-full w-[15rem] max-w-full border-r border-gray-100 bg-white px-5 shadow-xl"
    >
      <header class="mb-5 flex items-center">
        <MyBtn btn-icon aria-label="Menu" @click="close">
          <Bars3Icon class="!size-5" />
        </MyBtn>
      </header>

      <nav class="flex flex-col gap-2 text-sm lg:text-base">
        <template v-for="item in menu" :key="item.name">
          <router-link
            v-if="!item.hideInMenu && checkRole(currentRole, item.roles)"
            :to="{ name: item.name }"
            class="border-b border-gray-100"
            @click="close"
          >
            {{ item.title }}
          </router-link>
        </template>
      </nav>
    </aside>
  </transition>

  <transition name="fade">
    <div
      v-if="show"
      class="fixed md:hidden top-0 left-0 z-[49] h-full w-full backdrop-blur-sm"
      @click.self="close"
    />
  </transition>
</template>

<style scoped>
header {
  height: var(--header-height);

  @media only screen and (width >= 64rem) {
    height: var(--header-height-lg);
  }
}

nav a {
  @apply no-underline hover:underline block w-full;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
