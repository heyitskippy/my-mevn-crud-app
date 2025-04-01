<script setup lang="ts" generic="T extends InputValue">
import type { InputValue } from '_/types/ui'

import { computed } from 'vue'

import { fixTimezoneOffset } from '_/helpers'

const props = defineProps<{
  modelValue: T
  name: string
  label: string
  type?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T | string]
}>()

const value = computed({
  get() {
    const v = props.modelValue

    if (props.type === 'datetime-local') return prepareDateValue(v)

    return v
  },
  set(value) {
    if (props.type === 'datetime-local') value = fixTimezoneOffset(value, true).toJSON()

    emit('update:modelValue', value)
  },
})

function prepareDateValue(date: T) {
  return fixTimezoneOffset(date).toJSON().split('Z')[0] ?? ''
}
// TODO: disabled
</script>

<template>
  <div class="input-wrapper">
    <label :for="props.name" class="mb-1 subpixel-antialiased text-gray-900/60">
      {{ props.label }}
    </label>

    <input
      :id="props.name"
      v-model="value"
      :name="props.name"
      :type="props.type ?? 'text'"
      class="m-1 rounded-md px-4 py-2 text-gray-900/80 subpixel-antialiased caret-sky-500 shadow-md shadow-sky-50 outline outline-gray-200 transition-all hover:relative hover:z-30 hover:shadow-lg hover:shadow-sky-100/80 hover:outline-sky-200 focus:bg-sky-50/80 focus:text-gray-900/90 focus:!shadow-md focus:shadow-sky-100 focus:outline-3 focus:outline-sky-200"
    />
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.input-wrapper {
  @apply flex flex-col;
}
</style>
