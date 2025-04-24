<script setup lang="ts">
import { computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

import { sleep } from '_/helpers'

import MyToast from './MyToast.vue'

const ui = useUiStore()
const { toasterQueue } = storeToRefs(ui)

const numberOfVisible = computed(() =>
  toasterQueue.value.reduce((sum, toast) => {
    sum += +toast.visibility

    return sum
  }, 0),
)

function showToast(index: number) {
  toasterQueue.value[index].visibility = true
}

async function removeToast(index: number) {
  toasterQueue.value[index].visibility = false

  await sleep(300)

  ui.deleteToast(index)
}
</script>

<template>
  <div
    class="fixed top-5 right-0 z-[51] flex flex-wrap gap-2 lg:top-10 max-w-[15.5rem]"
    aria-live="assertive"
  >
    <template v-for="(toast, index) in toasterQueue" :key="toast.key">
      <MyToast
        :state="toast"
        :number-of-visible="numberOfVisible"
        :can-show="toasterQueue.toSpliced(index).every((toast) => toast.visibility)"
        @show-toast="showToast(index)"
        @remove-toast="removeToast(index)"
      />
    </template>
  </div>
</template>
