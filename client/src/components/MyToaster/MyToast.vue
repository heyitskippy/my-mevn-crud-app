<script setup lang="ts">
import type { ToastState } from '_/types/ui'

import { computed } from 'vue'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  state: ToastState
}>()
const emit = defineEmits<{
  'update:visibility': [value: false]
}>()

const isSuccess = computed(() => props.state.type === 'success')

const visibility = computed({
  get() {
    return props.state.visibility
  },
  set(value = false) {
    if (value) return

    emit('update:visibility', value)
  },
})
</script>

<template>
  <transition name="slide-fade">
    <div
      v-if="visibility"
      class="toast"
      :class="state.type"
      role="alert"
      @click="visibility = false"
    >
      <div class="icon mr-3">
        <CheckCircleIcon v-if="isSuccess" />

        <XCircleIcon v-else />
      </div>

      <div class="break-words text-sm">{{ state.text }}</div>
    </div>
  </transition>
</template>

<style scoped>
@reference "@/assets/style.css";

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast {
  @apply mr-5 flex w-[15rem] max-w-full cursor-pointer items-center rounded-md border border-gray-200 bg-white/20 px-3 py-1 shadow-xl ring-1 backdrop-blur-sm lg:mr-10 transition-all;

  .icon :deep(svg) {
    @apply size-6;
  }

  &.success {
    @apply bg-sky-50 shadow-sky-200 ring-sky-200 inset-shadow-sky-100 hover:shadow-sky-300/80;

    .icon :deep(svg) {
      @apply text-sky-400;
    }
  }

  &.error {
    @apply bg-pink-50 shadow-pink-200 ring-pink-200 inset-shadow-pink-100 hover:shadow-pink-300/80;

    .icon :deep(svg) {
      @apply text-pink-400;
    }
  }
}
</style>
