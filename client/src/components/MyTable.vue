<script setup lang="ts" generic="T extends IModel | NullableEntity | object">
import type { ID, IModel, Maybe, NullableEntity } from '_/types'
import type { TableHeader } from '_/types/ui'
import type { TMap } from '_/types/utilities'

import { prepareDateTime } from '_/helpers'

const props = defineProps<{
  headers: TableHeader<T>[]
  items: T[] | TMap<T>
  showRowNumber?: boolean
  showActions?: boolean
}>()

const POSITIONS: Record<NonNullable<TableHeader['position']>, string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
}

const getKey = (item: T | [Maybe<ID>, T]) => {
  if (Array.isArray(item)) item = item[1]

  if ('key' in item) return item.key
  else if ('id' in item) return String(item.id)

  return undefined
}

const getField = (item: T | [Maybe<ID>, T], key: TableHeader<T>['field']) => {
  if (!Array.isArray(item) && key in item) return item[key]

  if (Array.isArray(item) && key in item[1]) return item[1][key]

  return undefined
}
</script>

<template>
  <div class="my-table">
    <div class="my-table-header-group">
      <div class="table-row">
        <div v-if="props.showRowNumber" class="my-table-cell px-4 py-3" />

        <div
          v-for="header in props.headers"
          :key="`h-${String(header.field)}`"
          class="my-table-cell px-4 py-3 font-bold"
          :class="POSITIONS[header?.position ?? 'start']"
        >
          {{ header.headerName }}
        </div>

        <div v-if="props.showActions" class="my-table-cell px-4 py-3" />
      </div>
    </div>
    <div class="table-row-group">
      <div
        v-for="(item, index) in props.items"
        :key="getKey(item) ?? index"
        class="table-row group cursor-pointer shadow-blue-50 outline-gray-200 transition-shadow hover:relative hover:z-30 hover:shadow-lg hover:outline-1 active:outline-blue-200 active:shadow-blue-100"
      >
        <div
          v-if="props.showRowNumber"
          class="my-table-cell text-sm px-4 py-2 bg-white"
          :class="POSITIONS['start']"
        >
          {{ index + 1 }}
        </div>

        <div
          v-for="header in props.headers"
          :key="`r-${index}-c-${String(header.field)}`"
          class="my-table-cell px-4 py-2 bg-white"
          data-test="cell"
          :class="POSITIONS[header?.position ?? 'start']"
        >
          <slot :name="header.field" :item="item">
            <template v-if="header.type === 'datetime'">
              {{ prepareDateTime(getField(item, header.field)) }}
            </template>

            <template v-else>
              {{ getField(item, header.field) }}
            </template>
          </slot>
        </div>

        <div
          v-if="props.showActions"
          class="my-table-cell px-4 py-2 bg-white"
          :class="POSITIONS['end']"
        >
          <span class="opacity-0 group-hover:opacity-100 transition-opacity">actions</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.my-table {
  @apply table w-full table-auto border-collapse border border-gray-200 bg-white shadow-lg shadow-blue-50;
}

.my-table-header-group {
  @apply sticky z-40 table-header-group bg-white/70 shadow-sm shadow-blue-50 backdrop-blur-sm;

  top: var(--header-height);
}

.my-table-cell {
  @apply table-cell border-y border-gray-200;
}
</style>
