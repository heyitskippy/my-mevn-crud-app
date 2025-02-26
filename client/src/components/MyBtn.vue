<script lang="ts" setup>
const props = defineProps<{
  secondary?: boolean
}>()
</script>

<template>
  <button
    class="cursor-pointer rounded-md px-6 py-1 text-gray-900/80 inset-shadow-sm ring-3 shadow-xl transition-all active:bg-white active:text-gray-900/90"
    :class="props.secondary ? 'secondary' : 'primary'"
  >
    <span class="text-lg font-extrabold subpixel-antialiased">
      <slot />
    </span>
  </button>
</template>

<style scoped>
@reference "@/assets/style.css";

.primary {
  @apply bg-blue-50 shadow-blue-200 ring-blue-200 inset-shadow-blue-100 hover:shadow-blue-300/80 active:shadow-blue-300;
}

.secondary {
  @apply bg-pink-50 shadow-pink-200 ring-pink-200 inset-shadow-pink-100 hover:shadow-pink-300/80 active:shadow-pink-300;
}
</style>
