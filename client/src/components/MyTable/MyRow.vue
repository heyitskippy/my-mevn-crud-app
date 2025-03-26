<script setup lang="ts" generic="T extends TableType">
import type { ID, Maybe } from '_/types'
import type { TableHeader, TableType } from '_/types/ui'

import { computed } from 'vue'

import { isModelLike, prepareDateTime } from '_/helpers'

import { TABLE_POSITIONS } from '@/constants'

const props = defineProps<{
  index: number
  item: T | [Maybe<ID>, T]

  headers: TableHeader<T>[]

  showRowNumber?: boolean
  showActions?: boolean
}>()

const emit = defineEmits<{
  goTo: [id: Maybe<ID>]
}>()

const colorClass = computed(() => {
  const item = getItem(props.item)
  if (!isModelLike(item)) return ''

  if (item.isDeleted) return 'red'
  if (item.isNew()) return 'blue'
  if (item.isDirty()) return 'yellow'

  return ''
})

const getField = <F = unknown,>(key: keyof T) => {
  const el = getItem(props.item)
  if (!el) return undefined

  return el[key] as F
}

const getItem = (item: T | [Maybe<ID>, T]): T | undefined => {
  const key = props.headers[0].field

  if (!Array.isArray(item) && key in item) return item

  if (Array.isArray(item) && key in item[1]) return item[1]

  return undefined
}

function handleClick() {
  const id = getField<ID>('id' as keyof T) ?? null

  emit('goTo', id)
}
</script>

<template>
  <div
    class="table-row group cursor-pointer shadow-blue-50 outline-gray-200 transition-shadow hover:relative hover:z-30 hover:shadow-lg hover:outline-1 active:outline-blue-200 active:shadow-blue-100"
    :class="colorClass"
    @click="handleClick"
  >
    <div
      v-if="props.showRowNumber"
      class="my-table-cell text-sm px-4 py-2 bg-white"
      :class="TABLE_POSITIONS['start']"
    >
      {{ index + 1 }}
    </div>

    <div
      v-for="header in props.headers"
      :key="`r-${index}-c-${String(header.field)}`"
      class="my-table-cell px-4 py-2 bg-white"
      data-test="cell"
      :class="TABLE_POSITIONS[header?.position ?? 'start']"
    >
      <slot :name="header.field" :item="item">
        <template v-if="header.type === 'datetime'">
          {{ prepareDateTime(getField(header.field)) }}
        </template>

        <template v-else>
          {{ getField(header.field) }}
        </template>
      </slot>
    </div>

    <div
      v-if="props.showActions"
      class="my-table-cell px-4 py-2 bg-white"
      :class="TABLE_POSITIONS['end']"
    >
      <span class="opacity-0 group-hover:opacity-100 transition-opacity">actions</span>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.my-table-cell {
  @apply table-cell border-y border-gray-200;
}

.red {
  @apply shadow-pink-50 active:outline-pink-200 active:shadow-pink-100 outline-pink-200;
}

.red .my-table-cell {
  @apply bg-pink-50  border-pink-200;
}

.yellow {
  @apply shadow-amber-50 active:outline-amber-200 active:shadow-amber-100 outline-amber-200;
}

.yellow .my-table-cell {
  @apply bg-amber-50  border-amber-200;
}

.blue {
  @apply outline-blue-200;
}

.blue .my-table-cell {
  @apply bg-blue-50  border-blue-200;
}
</style>
