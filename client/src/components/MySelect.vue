<script setup lang="ts" generic="O extends SelectOption">
import type { WritableComputedRef } from 'vue'

import type { ID, Maybe } from '_/types'
import type { SelectOption } from '_/types/ui'

import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { onClickOutside, useVModel } from '@vueuse/core'

import { ChevronUpDownIcon } from '@heroicons/vue/16/solid'

type V = Maybe<ID | string | undefined>

const props = defineProps<{
  modelValue: V
  options: O[]

  name: string
  label?: string

  optionTextKey?: keyof O

  disabled?: boolean
  required?: boolean

  validation?: string | true
}>()

const emit = defineEmits<{
  'update:modelValue': [value: V]
}>()

const modelValue: WritableComputedRef<V> = useVModel(props, 'modelValue', emit)

const error = computed(() => (props.validation === true ? '' : props.validation))

const selectedRef = useTemplateRef<HTMLDivElement>('selectedRef')
const itemsRef = useTemplateRef<HTMLDivElement>('itemsRef')

const show = ref(false)

onMounted(() => init())

const currentText = computed(
  () => props.options.find((option) => option.id === modelValue.value)?.[getKey()] ?? '',
)

function handleSelect(id: V) {
  if (props.disabled) return

  modelValue.value = id
  show.value = false
}

function handleSelectedClick() {
  if (props.disabled) return

  show.value = !show.value
}

function init() {
  if (!selectedRef.value || !itemsRef.value || props.disabled) return

  onClickOutside(itemsRef, () => (show.value = false), { ignore: [selectedRef] })
}

const getKey = () => (props.optionTextKey ?? 'name') as keyof O
</script>

<template>
  <div class="select-wrapper group" :class="{ error }">
    <label
      v-if="props.label"
      :for="props.name"
      class="mb-0.5 lg:mb-1 subpixel-antialiased text-gray-900/60 text-sm lg:text-base"
    >
      {{ props.label }}<span v-if="props.required" class="align-top text-pink-600">*</span>
    </label>

    <select
      :id="props.name"
      v-model="modelValue"
      :name="props.name"
      class="hidden"
      :disabled="props.disabled"
      :required="props.required"
    >
      <option v-for="option in options" :key="`option-${option.id}`" :value="option.id">
        {{ option[getKey()] }}
      </option>
    </select>

    <div
      ref="selectedRef"
      class="select"
      :class="{ show: show && !props.disabled }"
      :disabled="props.disabled"
      @click.stop="handleSelectedClick"
    >
      <div>
        {{ currentText }}
      </div>

      <ChevronUpDownIcon
        class="size-3.5 lg:size-4 text-gray-900/60 group-hover:not-[disabled='true']:text-sky-900/60"
      />
    </div>

    <div
      v-if="error"
      class="absolute -bottom-4.5 w-full text-right text-xs whitespace-nowrap text-pink-600 lg:-bottom-5"
      data-test="error"
    >
      {{ error }}
    </div>

    <div ref="itemsRef" class="items" :class="{ hidden: !show || props.disabled }">
      <div
        v-for="option in options"
        :key="`item-${option.id}`"
        :class="{
          '!text-sky-900/80 !bg-sky-50/80': modelValue === option.id,
        }"
        @click="handleSelect(option.id)"
      >
        {{ option[getKey()] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.select-wrapper {
  @apply relative m-1 mb-4 flex flex-col lg:mb-5;
}

.select {
  @apply flex h-9 cursor-pointer items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-900/80 subpixel-antialiased shadow-md shadow-sky-50 outline outline-gray-200 transition-all hover:not-[disabled="true"]:shadow-lg hover:not-[disabled="true"]:shadow-sky-100/80 hover:not-[disabled="true"]:outline-sky-200 active:not-[disabled="true"]:bg-sky-50/80 active:not-[disabled="true"]:text-gray-900/90 active:not-[disabled="true"]:!shadow-md active:not-[disabled="true"]:shadow-sky-100 active:not-[disabled="true"]:outline-3 active:not-[disabled="true"]:outline-sky-200 lg:h-10 lg:px-4 lg:text-base;

  &.show {
    @apply bg-sky-50/80 text-gray-900/90 shadow-md shadow-sky-100 outline-sky-200;
  }

  &[disabled='true'] {
    @apply cursor-not-allowed bg-gray-100 text-gray-900/40;
  }
}

.select-wrapper.error {
  label {
    @apply text-pink-900/60;
  }

  .select {
    @apply outline-pink-200;
  }
}

.items {
  @apply absolute top-full right-0 left-0 z-30 mt-1 max-h-[25rem] w-full overflow-y-auto scroll-smooth rounded-md shadow-lg shadow-sky-100/80 outline outline-gray-200 transition-all hover:shadow-sky-100/80 hover:outline-sky-200 active:text-gray-900/90 active:!shadow-md active:shadow-sky-100 active:outline-3 active:outline-sky-200;

  div {
    @apply flex h-9 cursor-pointer items-center bg-white px-3 py-2 text-sm text-gray-900/60 subpixel-antialiased hover:bg-sky-50 hover:text-sky-900/60 active:text-sky-900/80 lg:h-10 lg:px-4 lg:text-base;
  }
}
</style>
