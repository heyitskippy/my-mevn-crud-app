<script setup lang="ts" generic="O extends SelectOption">
import type { WritableComputedRef } from 'vue'

import type { ID, Maybe } from '_/types'
import type { RefComponent, SelectOption } from '_/types/ui'

import { computed, onMounted, ref } from 'vue'
import { onClickOutside, useVModel } from '@vueuse/core'

import { ChevronUpDownIcon } from '@heroicons/vue/16/solid'

type V = Maybe<ID | string | undefined>

const props = defineProps<{
  modelValue: V
  options: O[]

  name: string
  label?: string

  optionTextKey?: keyof O
}>()

const emit = defineEmits<{
  'update:modelValue': [value: V]
}>()

const modelValue: WritableComputedRef<V> = useVModel(props, 'modelValue', emit)

const selectedRef: RefComponent<typeof HTMLDivElement> = ref(null)
const itemsRef: RefComponent<typeof HTMLDivElement> = ref(null)

const show = ref(false)

onMounted(() => init())

const currentText = computed(
  () => props.options.find((option) => option.id === modelValue.value)?.[getKey()] ?? '',
)

function handleSelect(id: V) {
  modelValue.value = id
  show.value = false
}

function handleSelectedClick() {
  show.value = !show.value
}

function init() {
  if (!selectedRef.value || !itemsRef.value) return

  onClickOutside(itemsRef.value, (e) => {
    if (e.target === selectedRef.value || e.target === selectedRef.value?.children[0]) return

    show.value = false
  })
}

const getKey = () => (props.optionTextKey ?? 'name') as keyof O

// TODO: disabled
</script>

<template>
  <div class="select-wrapper relative group">
    <label v-if="props.label" :for="props.name" class="mb-1 subpixel-antialiased text-gray-900/60">
      {{ props.label }}
    </label>

    <select :id="props.name" v-model="modelValue" :name="props.name" class="hidden">
      <option v-for="option in options" :key="`option-${option.id}`" :value="option.id">
        {{ option[getKey()] }}
      </option>
    </select>

    <div ref="selectedRef" class="select" :class="{ show }" @click.stop="handleSelectedClick">
      <div>
        {{ currentText }}
      </div>

      <ChevronUpDownIcon class="size-4 text-gray-900/60 group-hover:text-sky-900/60" />
    </div>

    <div ref="itemsRef" class="items" :class="{ hidden: !show }">
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
  @apply flex flex-col m-1;
}
.select {
  @apply flex h-10 cursor-pointer items-center justify-between rounded-md bg-white px-4 py-2 text-gray-900/80 subpixel-antialiased shadow-md shadow-sky-50 outline outline-gray-200 transition-all hover:shadow-lg hover:shadow-sky-100/80 hover:outline-sky-200 active:bg-sky-50/80 active:text-gray-900/90 active:!shadow-md active:shadow-sky-100 active:outline-3 active:outline-sky-200;

  &.show {
    @apply bg-sky-50/80 text-gray-900/90 shadow-md shadow-sky-100  outline-sky-200;
  }
}

.items {
  @apply absolute top-full right-0 left-0 z-30 mt-1 max-h-[400px] w-full overflow-y-auto scroll-smooth rounded-md shadow-lg shadow-sky-100/80 outline  outline-gray-200 transition-all hover:shadow-sky-100/80 hover:outline-sky-200 active:text-gray-900/90 active:!shadow-md active:shadow-sky-100 active:outline-3 active:outline-sky-200;

  div {
    @apply flex h-10 cursor-pointer items-center bg-white px-4 py-2 text-gray-900/60 subpixel-antialiased hover:bg-sky-50/80 hover:text-sky-900/60 active:text-sky-900/80;
  }
}
</style>
