<script setup lang="ts">
import type { Maybe } from '_/types'
import type { UserForm } from '_/types/users'

import { computed, onMounted, ref, shallowRef } from 'vue'

import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'

import User from '@/models/User'

import { INPUT_TYPES, USER_FORM_LABELS, USER_HEADERS } from '@/constants'

import MyHeading from '@/components/MyHeading.vue'
import MyInput from '@/components/MyInput.vue'
import MyBtn from '@/components/MyBtn.vue'

const BACK_LINK = { name: 'users-list' }

const ui = useUiStore()
const store = useUsersStore()

const { userIsLoading } = storeToRefs(store)
ui.setProgress(userIsLoading)

const id = useRouteParams<string | null>('id', null)
const entity = shallowRef<Maybe<User>>(null)

const title = computed(() => {
  if (!entity.value) return 'User'

  return entity.value.isNew() ? 'User: create' : 'User: edit'
})

const headers = USER_HEADERS
const formLabels = USER_FORM_LABELS

const form = ref<UserForm>(User.prepareForm())
const formIsDirty = computed(() => entity.value?.checkIfDirty(form.value) ?? false)

onMounted(async () => {
  entity.value = (await store.getUserById(id.value)) ?? store.createUser() ?? null

  if (!entity.value) {
    // goTo 404
    return
  }

  const isNew = entity.value.isNew()
  const isDirty = entity.value.isDirty()

  if (!isNew || (isNew && isDirty)) resetForm()
})

function resetForm(complete = false) {
  if (complete) resetEntity()

  User.prepareForm(entity.value?.toJSON(), form.value)
}

function save() {
  goBack()
}

async function remove() {
  if (!entity.value) return

  resetEntity()

  entity.value.isDeleted = true

  goBack()
}

function resetEntity() {
  entity.value?.reset()
}

function update() {
  if (formIsDirty.value) entity.value?.update(form.value)

  const isNew = entity.value?.isNew()
  const isDirty = entity.value?.isDirty()
  const isDeleted = entity.value?.isDeleted

  if ((isNew && !isDirty) || (isNew && isDeleted)) store.removeUser(null)
}

const router = useRouter()
function goBack() {
  router.push(BACK_LINK)
}

function getType(key: keyof UserForm) {
  const headerType = headers.find(({ field }) => field === key)?.type ?? 'text'

  return INPUT_TYPES[headerType]
}

onBeforeRouteLeave(() => queueMicrotask(update))
</script>

<template>
  <div class="flex justify-between mb-10">
    <MyHeading>{{ title }}</MyHeading>

    <div class="flex self-end ml-4 mb-4">
      <MyBtn :disabled="!formIsDirty" @click="save">Save</MyBtn>

      <MyBtn :disabled="!formIsDirty" class="ml-2" @click="resetForm(true)">Reset</MyBtn>

      <MyBtn secondary class="ml-4" @click="remove">Delete</MyBtn>
    </div>
  </div>

  <div class="max-w-[440px] mx-auto my-4">
    <MyInput
      v-for="(label, key) in formLabels"
      :key="key"
      v-model="form[key]"
      :name="key"
      :label="label"
      class="mb-3"
      :type="getType(key)"
    />
  </div>
</template>
