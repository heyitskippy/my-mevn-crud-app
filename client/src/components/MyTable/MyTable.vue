<script setup lang="ts" generic="T extends TableType">
import type { ID, Maybe } from '_/types'
import type { BtnAction, TableHeader, TableType } from '_/types/ui'
import type { TMap } from '_/types/utilities'

import { TABLE_POSITIONS } from '@/constants'

import MyRow from './MyRow.vue'
import { getTableItem } from '_/helpers'

const props = defineProps<{
  headers: TableHeader<T>[]
  items: T[] | TMap<T>

  showRowNumber?: boolean
  showActions?: boolean
}>()

const emit = defineEmits<{
  goTo: [id: Maybe<ID>]
  handleItem: [action: BtnAction, item: T | undefined]
}>()

const getKey = (item: T | [Maybe<ID>, T]) => {
  if (Array.isArray(item)) item = item[1]

  if ('key' in item) return item.key
  else if ('id' in item) return { value: String(item.id) }

  return { value: undefined }
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
          :class="TABLE_POSITIONS[header?.position ?? 'start']"
        >
          {{ header.headerName }}
        </div>

        <div v-if="props.showActions" class="my-table-cell px-4 py-3" />
      </div>
    </div>

    <div class="table-row-group">
      <MyRow
        v-for="(item, index) in props.items"
        :key="getKey(item).value ?? index"
        :index="index"
        :item="getTableItem(item, props.headers[0].field)"
        v-bind="props"
        @go-to="(id) => emit('goTo', id)"
        @handle-item="(action, item) => emit('handleItem', action, item)"
      >
        <template v-for="header in props.headers" #[header.field]>
          <slot :name="header.field" :item="getTableItem(item, header.field)" />
        </template>
      </MyRow>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.my-table {
  @apply table w-full table-auto border-collapse border border-gray-200 bg-white shadow-lg shadow-sky-50;
}

.my-table-header-group {
  @apply sticky z-40 table-header-group bg-white/70 shadow-sm shadow-sky-50 outline-1 outline-gray-200/30 backdrop-blur-sm;

  top: var(--header-height);
}

.my-table-cell {
  @apply table-cell border-y border-gray-200;
}
</style>
