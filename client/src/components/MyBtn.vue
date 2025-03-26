<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  link?: RouteLocationRaw
  secondary?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <div>
    <button
      v-if="!props.link"
      class="my-btn"
      :class="props.secondary ? 'secondary' : 'primary'"
      :disabled="props.disabled"
    >
      <span class="text-lg font-extrabold subpixel-antialiased">
        <slot />
      </span>
    </button>

    <router-link
      v-else
      :to="props.link"
      class="my-btn-link"
      :class="props.secondary ? 'secondary' : 'primary'"
      :disabled="props.disabled"
    >
      <span class="text-lg font-extrabold subpixel-antialiased">
        <slot />
      </span>
    </router-link>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.my-btn,
.my-btn-link {
  @apply cursor-pointer rounded-md px-6 py-1 text-gray-900/80 inset-shadow-sm ring-3 m-1 z-10 shadow-xl transition-all active:bg-white active:text-gray-900/90;
}

.my-btn-link {
  @apply no-underline;

  display: block;
}

.primary {
  @apply bg-blue-50 shadow-blue-200 ring-blue-200 inset-shadow-blue-100 hover:shadow-blue-300/80 active:shadow-blue-300;
}

.secondary {
  @apply bg-pink-50 shadow-pink-200 ring-pink-200 inset-shadow-pink-100 hover:shadow-pink-300/80 active:shadow-pink-300;
}

.my-btn:disabled {
  @apply cursor-not-allowed bg-gray-100 ring-gray-200 text-gray-900/40 shadow-gray-200;
}
</style>
