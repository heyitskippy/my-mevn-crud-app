<script setup lang="ts" generic="T extends InputValue">
import type { InputValue } from '_/types/ui'

import { computed } from 'vue'

import { fixTimezoneOffset } from '_/helpers'

const props = defineProps<{
  modelValue: T

  name: string
  label: string

  type?: string
  disabled?: boolean
  required?: boolean

  validation?: string | true
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

const error = computed(() => (props.validation === true ? '' : props.validation))

function prepareDateValue(date: T) {
  return fixTimezoneOffset(date).toJSON().split('Z')[0] ?? ''
}
</script>

<template>
  <div class="input-wrapper" :class="{ error }">
    <label :for="props.name">
      {{ props.label }}<span v-if="props.required" class="align-top text-pink-600">*</span>
    </label>

    <input
      :id="props.name"
      v-model="value"
      :name="props.name"
      :type="props.type ?? 'text'"
      :disabled="props.disabled"
      :required="props.required"
    />

    <div
      v-if="error"
      class="absolute whitespace-nowrap w-full -bottom-5 text-xs text-pink-600 text-right"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.input-wrapper {
  @apply relative m-1 mb-5 flex flex-col;

  label {
    @apply mb-1 subpixel-antialiased text-gray-900/60;
  }

  input {
    @apply rounded-md px-4 py-2 text-gray-900/80 subpixel-antialiased caret-sky-500 shadow-md shadow-sky-50 outline outline-gray-200 transition-all hover:not-disabled:relative hover:not-disabled:z-30 hover:not-disabled:shadow-lg hover:not-disabled:shadow-sky-100/80 hover:not-disabled:outline-sky-200 focus:bg-sky-50/80 focus:text-gray-900/90 focus:!shadow-md focus:shadow-sky-100 focus:outline-3 focus:outline-sky-200;

    &:disabled {
      @apply cursor-not-allowed bg-gray-100 text-gray-900/40;
    }
  }

  &.error {
    label {
      @apply text-pink-900/60;
    }

    input {
      @apply outline-pink-200;
    }
  }
}
</style>
