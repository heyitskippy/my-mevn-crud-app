<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  link?: RouteLocationRaw

  secondary?: boolean
  btnIcon?: boolean

  type?: string
  disabled?: boolean

  name?: string
  form?: string
}>()
</script>

<template>
  <div class="btn-wrapper">
    <Component
      :is="!props.link ? 'button' : 'router-link'"
      :to="props.link"
      class="my-btn my-auto"
      :class="[
        props.secondary ? 'secondary' : 'primary',
        {
          icon: props.btnIcon || $slots['prepend-icon'],
          'btn-icon': props.btnIcon,
          '!pl-5': $slots['prepend-icon'],
        },
      ]"
      :disabled="props.disabled"
      :type="props.type"
      :form="props.form"
      :name="props.name"
    >
      <span v-if="$slots['prepend-icon']" class="mr-2">
        <slot name="prepend-icon" />
      </span>

      <span v-if="!props.btnIcon" class="btn-text">
        <slot />
      </span>

      <slot v-else />
    </Component>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.my-btn {
  @apply z-10 m-1 flex cursor-pointer items-center rounded-md px-6 py-1 no-underline shadow-xl ring-3 inset-shadow-sm transition-all active:bg-white;

  .btn-text {
    @apply bg-linear-to-b bg-clip-text text-lg font-extrabold text-transparent subpixel-antialiased;
  }

  &.btn-icon {
    @apply m-0 rounded-2xl p-0.5 shadow-lg ring-0;
  }

  &.icon :deep(svg) {
    @apply size-4;
  }
}

.primary {
  @apply bg-sky-50 shadow-sky-200 ring-sky-200 inset-shadow-sky-100 hover:shadow-sky-300/80 active:shadow-sky-300;

  .btn-text {
    @apply from-sky-600 to-gray-900;
  }

  &.btn-icon :deep(svg) {
    @apply hover:text-sky-500;
  }

  &.icon :deep(svg) {
    @apply text-sky-400;
  }
}

.secondary {
  @apply bg-pink-50 shadow-pink-200 ring-pink-200 inset-shadow-pink-100 hover:shadow-pink-300/80 active:shadow-pink-300;

  .btn-text {
    @apply from-pink-600 to-gray-900;
  }

  &.btn-icon :deep(svg) {
    @apply hover:text-pink-500;
  }

  &.icon :deep(svg) {
    @apply text-pink-400;
  }
}

.my-btn:disabled {
  @apply cursor-not-allowed bg-gray-100 shadow-gray-200 ring-gray-200;

  .btn-text {
    @apply from-gray-300 to-gray-900/40;
  }

  &.icon:disabled :deep(svg) {
    @apply !text-gray-900/40;
  }
}
</style>
