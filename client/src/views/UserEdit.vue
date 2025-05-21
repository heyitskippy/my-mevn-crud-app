<script setup lang="ts">
import type { Maybe } from '_/types'
import type { UserForm } from '_/types/users'
import { Role } from '_/types/users'

import { computed, onMounted, ref, shallowRef } from 'vue'

import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useRouteParams } from '@vueuse/router'

import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'

import User from '@/models/User'

import { useError404 } from '@/composables/useError404'
import { getType } from '_/helpers'

import { USER_FIELDS } from '@/constants'

import { ArrowUturnLeftIcon, XCircleIcon, PencilSquareIcon } from '@heroicons/vue/16/solid'

import MyPageWrapper from '@/components/MyPageWrapper.vue'
import MyPageTitle from '@/components/MyPageTitle.vue'
import MyBtn from '@/components/MyBtn.vue'
import MyInput from '@/components/MyInput.vue'
import MySelect from '@/components/MySelect.vue'

type Form = UserForm

class Model extends User {}

const BACK_LINK = { name: 'users-list' }

const ui = useUiStore()
const store = useUsersStore()

const { userIsLoading } = storeToRefs(store)
ui.setProgress(userIsLoading)

const id = useRouteParams<string | null>('id', null)
const entity = shallowRef<Maybe<Model | undefined>>(null)

const title = computed(() => {
  if (!entity.value) return 'User'

  return entity.value.isNew() ? 'User: create' : 'User: edit'
})

const formFields = USER_FIELDS

const form = ref<Form>(Model.prepareForm())
const formIsDirty = computed(() => entity.value?.checkIfDirty(form.value) ?? false)

const validation = computed<Partial<Record<keyof Form, true | string>>>(() => {
  const isNew = entity.value?.isNew()
  const isDirty = entity.value?.isDirty()

  if ((!formIsDirty.value && !isNew) || (!formIsDirty.value && isNew && !isDirty)) return {}

  return entity.value?.validate(form.value) ?? {}
})

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  entity.value =
    (await store.getUserById(id.value)) ?? (id.value === null ? store.createUser() : undefined)

  if (!entity.value) {
    await useError404(route, router)

    return
  }

  const isNew = entity.value.isNew()
  const isDirty = entity.value.isDirty()

  if (!isNew || (isNew && isDirty)) resetForm()
})

function resetForm(complete = false) {
  if (complete) resetEntity()

  Model.prepareForm(entity.value?.toJSON(), form.value)
}

function save() {
  if (!formIsDirty.value) return

  goBack()
}

async function remove() {
  if (!entity.value) return

  resetEntity()

  entity.value.delete()

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

function goBack() {
  router.push(BACK_LINK)
}

function getReadonly(key: keyof Form) {
  const action = entity.value?.isNew() ? 'create' : 'edit'
  const readonly = formFields[key]?.readonly ?? {
    create: false,
    edit: false,
  }

  return readonly[action]
}

function getRequired(key: keyof Form) {
  return formFields[key]?.required ?? false
}

const options = shallowRef({
  items: [],
  role: Object.values(Role).map((name) => ({ id: name, name })),
})

function getOptionsKey(key: keyof Form) {
  return (formFields[key]?.options ?? 'items') as keyof typeof options.value
}

onBeforeRouteLeave(() => queueMicrotask(update))
</script>

<template>
  <MyPageWrapper>
    <MyPageTitle>
      <template #title>
        {{ title }}
      </template>

      <template #actions>
        <MyBtn
          :disabled="!formIsDirty"
          title="Save locally"
          type="submit"
          form="user"
          @click="save"
        >
          <template #prepend-icon>
            <PencilSquareIcon />
          </template>

          Save
        </MyBtn>

        <MyBtn
          form="user"
          :disabled="!formIsDirty"
          title="Reset form"
          type="reset"
          @click="resetForm(true)"
        >
          <template #prepend-icon>
            <ArrowUturnLeftIcon />
          </template>

          Reset
        </MyBtn>

        <MyBtn
          secondary
          class="ml-1 lg:ml-2"
          title="Soft delete locally"
          type="button"
          @click="remove"
        >
          <template #prepend-icon>
            <XCircleIcon />
          </template>

          Delete
        </MyBtn>
      </template>
    </MyPageTitle>

    <form
      id="user"
      novalidate
      class="max-w-lg mx-auto my-2 lg:my-4"
      @submit.prevent="save"
      @keyup.enter="save"
    >
      <template v-for="(field, key) in formFields" :key="key">
        <MyInput
          v-if="getType(key, formFields) !== 'select'"
          v-model="form[key]"
          :name="key"
          :label="field.label"
          :type="getType(key, formFields)"
          :disabled="getReadonly(key)"
          :required="getRequired(key)"
          :validation="validation[key]"
          :autocomplete="field.autocomplete"
        />

        <MySelect
          v-else
          v-model="form[key]"
          :options="options[getOptionsKey(key)]"
          :name="key"
          :label="field.label"
          :disabled="getReadonly(key)"
          :required="getRequired(key)"
          :validation="validation[key]"
        />
      </template>
    </form>
  </MyPageWrapper>
</template>
