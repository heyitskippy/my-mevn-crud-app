<script setup lang="ts" generic="T extends TableType">
import type { ID, Maybe } from '_/types'
import type { BtnAction, TableHeader, TableType } from '_/types/ui'
import type { TMap } from '_/types/utilities'

import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

import { getTableItem } from '_/helpers'

import { TABLE_POSITIONS } from '@/constants'

import MyRow from './MyRow.vue'

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

  return item.key
}
/**
 * Visibility depending on hovering ability
 */
const actionsVisibility = ref(true)
const mql = ref<Maybe<{ removeListener: () => void }>>(null)

onMounted(() => (mql.value = handleHovering()))
onBeforeRouteLeave(() => mql.value?.removeListener())

function handleHovering() {
  const mediaQueryList = window.matchMedia(
    '(any-hover: hover) and (pointer: coarse), (any-hover: hover) and (pointer: fine)',
  )

  const handleChange = (evt: MediaQueryList | MediaQueryListEvent) =>
    (actionsVisibility.value = evt.matches)

  handleChange(mediaQueryList)

  mediaQueryList.addEventListener('change', handleChange)

  return { removeListener: () => mediaQueryList.removeEventListener('change', handleChange) }
}
</script>

<template>
  <div class="my-table">
    <div class="my-table-header-group">
      <div class="table-row">
        <div v-if="props.showRowNumber" class="my-table-cell" />

        <div
          v-for="header in props.headers"
          :key="`h-${String(header.field)}`"
          class="my-table-cell padded font-bold"
          :class="TABLE_POSITIONS[header?.position ?? 'start']"
        >
          {{ header.headerName }}
        </div>

        <div v-if="props.showActions && actionsVisibility" class="my-table-cell padded" />
      </div>
    </div>

    <div class="flex max-sm:flex-wrap max-sm:gap-2 sm:table-row-group">
      <MyRow
        v-for="(item, index) in props.items"
        :key="getKey(item).value ?? index"
        :index="index"
        :item="getTableItem(item, props.headers[0].field)"
        v-bind="props"
        :show-actions="props.showActions && actionsVisibility"
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
  @apply sm:table w-full sm:table-auto border-collapse sm:border border-gray-200 bg-white shadow-lg shadow-sky-50;
}

.my-table-header-group {
  @apply sticky z-40 hidden sm:table-header-group bg-white/70 shadow-sm shadow-sky-50 outline-1 outline-gray-200/30 backdrop-blur-sm;

  top: var(--header-height);

  @media only screen and (width >= 64rem) {
    top: var(--header-height-lg);
  }
}

.my-table-cell {
  @apply table-cell border-y border-gray-200 text-sm lg:text-base;

  &.padded {
    @apply px-2 py-1.5 lg:px-4 lg:py-3;
  }
}
</style>
