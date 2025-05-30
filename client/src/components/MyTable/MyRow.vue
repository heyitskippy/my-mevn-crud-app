<script setup lang="ts" generic="T extends TableType">
import type { ID, IModel, Maybe } from '_/types'
import type { BtnAction, TableHeader, TableType } from '_/types/ui'
import type { TMap } from '_/types/utilities'

import { computed } from 'vue'

import { isModelLike, prepareDateTime } from '_/helpers'

import { TABLE_POSITIONS } from '@/constants'

import {
  CloudArrowUpIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/16/solid'

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

const valid = computed(() => {
  if (!isModelLike(props.item)) return true

  return props.item.isValid()
})

const colorClasses = computed(() => {
  const classes: string[] = []

  if (!isModelLike(props.item)) return classes

  if (props.item.isNew()) classes.push('blue')
  if (props.item.isDirty()) classes.push('yellow')
  if (getField<boolean>('isDeleted')) classes.push('red')

  if (!valid.value && !props.item.isNew()) classes.push('error')

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
    save: () =>
      (item.isNew() || (!item.isNew() && item.isDirty())) &&
      !getField('isDeleted') &&
      Object.entries(item.validate() ?? {}).every(([, valid]) => valid === true),
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
  <div class="my-table-row group" :class="colorClasses" @click="handleRowClick">
    <div
      v-if="props.showRowNumber"
      class="my-table-cell padded !text-sm"
      :class="TABLE_POSITIONS['start']"
    >
      {{ index + 1 }}
      <ExclamationCircleIcon
        v-if="!valid && !getField('isDeleted')"
        class="absolute top-0.5 lg:top-2 left-5 sm:left-4 lg:left-6 size-3.5 lg:size-4 text-rose-500"
      />
    </div>

    <div
      v-for="header in props.headers"
      :key="`r-${index}-c-${String(header.field)}`"
      class="my-table-cell padded"
      data-test="cell"
      :data-test-key="`r-${index}-c-${String(header.field)}`"
      :class="TABLE_POSITIONS[header?.position ?? 'start']"
    >
      <slot :name="header.field" :item="item">
        <span class="sm:hidden font-bold">{{ header.headerName }}: </span>

        <template v-if="header.type === 'datetime-local'">
          {{ prepareDateTime(getField(header.field)) }}
        </template>

        <template v-else>
          {{ getField(header.field) }}
        </template>
      </slot>
    </div>

    <div v-if="props.showActions" class="my-table-cell">
      <span class="actions">
        <MyBtn
          v-if="checkBtnVisibility('reset')"
          btn-icon
          title="Reset"
          name="reset"
          @click.prevent.stop="handleBtnClick('reset')"
        >
          <ArrowUturnLeftIcon />
        </MyBtn>

        <MyBtn
          v-if="checkBtnVisibility('save')"
          primary
          btn-icon
          title="Save to the server"
          name="save"
          @click.prevent.stop="handleBtnClick('save')"
        >
          <CloudArrowUpIcon />
        </MyBtn>

        <MyBtn
          v-if="checkBtnVisibility('softDelete')"
          secondary
          btn-icon
          title="Soft delete locally"
          :class="{ 'ml-1 lg:ml-2': valid }"
          name="softDelete"
          @click.prevent.stop="handleBtnClick('softDelete')"
        >
          <XMarkIcon />
        </MyBtn>

        <MyBtn
          v-if="checkBtnVisibility('delete')"
          secondary
          btn-icon
          class="ml-1 lg:ml-2"
          title="Delete from the server"
          name="delete"
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
  @apply sm:table-cell sm:border-y border-gray-200 bg-white text-sm lg:text-base;

  &.padded {
    @apply px-2 py-1 lg:px-4 lg:py-2;
  }
}

.my-table-row {
  @apply max-sm:p-1 max-sm:border border-gray-200 relative w-full cursor-pointer shadow-sky-50 outline-gray-200 transition-shadow hover:z-30 hover:shadow-lg hover:outline-1 active:shadow-sky-100 active:outline-sky-200 sm:table-row;

  &.green {
    @apply max-sm:bg-emerald-50 shadow-emerald-50 outline-emerald-200 active:shadow-emerald-100 active:outline-emerald-200;

    .my-table-cell {
      @apply bg-emerald-50  border-emerald-200;
    }
  }

  &.yellow {
    @apply max-sm:bg-amber-50 shadow-amber-50 outline-amber-200 active:shadow-amber-100 active:outline-amber-200;

    .my-table-cell {
      @apply bg-amber-50  border-amber-200;
    }
  }

  &.blue {
    @apply max-sm:bg-sky-50 shadow-sky-50 outline-sky-200 active:outline-sky-200 active:shadow-sky-100;

    .my-table-cell {
      @apply bg-sky-50  border-sky-200;
    }
  }

  &.error {
    @apply max-sm:bg-rose-50 shadow-rose-50 active:outline-rose-200 active:shadow-rose-100 outline-rose-200;

    .my-table-cell {
      @apply bg-rose-50 border-rose-200;
    }
  }

  &.red {
    @apply max-sm:bg-pink-50 shadow-pink-50 active:outline-pink-200 active:shadow-pink-100 outline-pink-200;

    .my-table-cell {
      @apply bg-pink-50 border-pink-200;
    }
  }
}

.actions {
  @apply absolute top-1.5 sm:top-[3px] right-2 lg:right-3 flex items-center justify-end gap-0.5 lg:gap-1 rounded-2xl bg-white/60 p-0.5 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 lg:top-[5px] lg:p-1;
}
</style>
