<script setup lang="ts">
import type { ToastState } from '_/types/ui'

import { watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

import { sleep } from '_/helpers'

import { TOAST_SIMULTANEOUS } from '@/constants'

import MyToast from './MyToast.vue'

const ui = useUiStore()
const { toasterQueue } = storeToRefs(ui)

watch(
  () => toasterQueue.value.length,
  async () => {
    if (!toasterQueue.value.length) return

    await triggerToast()
  },
  { immediate: true },
)

async function triggerToast() {
  if (getNumberOfVisible() >= TOAST_SIMULTANEOUS) return

  const toast = toasterQueue.value.find((toast) => !toast.visibility)
  if (!toast) return

  toast.visibility = true

  triggerToast()

  await sleep(toast.timeout)

  await removeToast(toast)
}

async function removeToast(toast: ToastState | undefined) {
  if (!toast) return

  toast.visibility = false

  await sleep(300)

  ui.deleteToast(toast?.key)
}

function getNumberOfVisible() {
  return toasterQueue.value.reduce((sum, toast) => {
    sum += +toast.visibility

    return sum
  }, 0)
}
</script>

<template>
  <div
    class="fixed top-5 right-0 z-[51] flex flex-wrap gap-2 lg:top-10 max-w-[15.5rem]"
    aria-live="assertive"
  >
    <template v-for="toast in toasterQueue" :key="toast.key">
      <MyToast :state="toast" @update:visibility="removeToast(toast)" />
    </template>
  </div>
</template>
