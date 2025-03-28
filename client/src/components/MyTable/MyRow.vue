<script setup lang="ts" generic="T extends TableType">
import type { ID, IModel, Maybe } from '_/types'
import type { BtnAction, TableHeader, TableType } from '_/types/ui'
import type { TMap } from '_/types/utilities'

import { computed } from 'vue'

import { isModelLike, prepareDateTime } from '_/helpers'

import { TABLE_POSITIONS } from '@/constants'

import { CloudArrowUpIcon, ArrowUturnLeftIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/16/solid'

import MyBtn from '@/components/MyBtn.vue'

const props = defineProps<{
  index: number
  item: T | undefined

  headers: TableHeader<T>[]

  showRowNumber?: boolean
  showActions?: boolean

  items?: T[] | TMap<T>
}>()

const emit = defineEmits<{
  goTo: [id: Maybe<ID>]
  handleItem: [action: BtnAction, item: T | undefined]
}>()

const colorClasses = computed(() => {
  const classes: string[] = []

  if (!isModelLike(props.item)) return classes

  if (getField<boolean>('isDeleted')) classes.push('red')
  if (props.item.isNew()) classes.push('blue')
  if (props.item.isDirty()) classes.push('yellow')

  if (props.item.updatedAt) {
    const now = new Date().getTime()
    const updatedAt = new Date(props.item.updatedAt).getTime()

    if (now - updatedAt <= 60000) classes.push('green')
  }

  return classes
})

function checkBtnVisibility(btn: BtnAction) {
  const item = props.item
  if (!isModelLike(item)) return true

  const btnVisibility: Record<BtnAction, () => boolean> = {
    save: () => (item.isNew() || (!item.isNew() && item.isDirty())) && !getField('isDeleted'),
    reset: () => getField('isDeleted') || (!item.isNew() && item.isDirty()),
    softDelete: () => !getField('isDeleted'),
    delete: () => !!getField('isDeleted'),
  }

  return btnVisibility[btn]()
}

function handleBtnClick(action: BtnAction) {
  emit('handleItem', action, props.item)
}

function handleRowClick() {
  const id = getField<ID>('id' as keyof T) ?? null

  emit('goTo', id)
}

const getField = <F = unknown,>(key: keyof T | keyof IModel) => {
  if (!isModelLike(props.item)) return undefined

  return props.item[key] as F
}
</script>

<template>
  <div
    class="table-row group cursor-pointer shadow-sky-50 outline-gray-200 transition-shadow hover:relative hover:z-30 hover:shadow-lg hover:outline-1 active:outline-sky-200 active:shadow-sky-100"
    :class="colorClasses"
    @click="handleRowClick"
  >
    <div
      v-if="props.showRowNumber"
      class="my-table-cell text-sm px-4 py-2"
      :class="TABLE_POSITIONS['start']"
    >
      {{ index + 1 }}
    </div>

    <div
      v-for="header in props.headers"
      :key="`r-${index}-c-${String(header.field)}`"
      class="my-table-cell px-4 py-2"
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

    <div v-if="props.showActions" class="my-table-cell">
      <span
        class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end absolute bg-white/60 backdrop-blur-md p-1 rounded-2xl right-3 top-[5px]"
      >
        <MyBtn
          v-if="checkBtnVisibility('reset')"
          btn-icon
          title="Reset"
          @click.prevent.stop="handleBtnClick('reset')"
        >
          <ArrowUturnLeftIcon />
        </MyBtn>

        <MyBtn
          v-if="checkBtnVisibility('save')"
          primary
          btn-icon
          title="Save to the server"
          @click.prevent.stop="handleBtnClick('save')"
        >
          <CloudArrowUpIcon />
        </MyBtn>

        <MyBtn
          v-if="checkBtnVisibility('softDelete')"
          secondary
          btn-icon
          title="Soft delete locally"
          class="ml-2"
          @click.prevent.stop="handleBtnClick('softDelete')"
        >
          <XMarkIcon />
        </MyBtn>

        <MyBtn
          v-if="checkBtnVisibility('delete')"
          secondary
          btn-icon
          class="ml-2"
          title="Delete from the server"
          @click.prevent.stop="handleBtnClick('delete')"
        >
          <TrashIcon />
        </MyBtn>
      </span>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.my-table-cell {
  @apply table-cell border-y border-gray-200 bg-white;
}

.green {
  @apply shadow-emerald-50 active:outline-emerald-200 active:shadow-emerald-100 outline-emerald-200;
}

.green .my-table-cell {
  @apply bg-emerald-50  border-emerald-200;
}

.yellow {
  @apply shadow-amber-50 active:outline-amber-200 active:shadow-amber-100 outline-amber-200;
}

.yellow .my-table-cell {
  @apply bg-amber-50  border-amber-200;
}

.blue {
  @apply shadow-sky-50 outline-sky-200 active:outline-sky-200 active:shadow-sky-100;
}

.blue .my-table-cell {
  @apply bg-sky-50  border-sky-200;
}

.red {
  @apply shadow-pink-50 active:outline-pink-200 active:shadow-pink-100 outline-pink-200;
}

.red .my-table-cell {
  @apply bg-pink-50  border-pink-200;
}
</style>
