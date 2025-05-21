<script setup lang="ts">
import type { Maybe } from '_/types'
import type { LoginForm } from '_/types/ui'

import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { isEqual } from 'lodash-es'

import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

import { getType } from '_/helpers'
import { checkEmail, checkEmptiness } from '_/helpers/validation'

import { LOGIN_FIELDS } from '@/constants'

import MyPageWrapper from '@/components/MyPageWrapper.vue'
import MyHeading from '@/components/MyHeading.vue'
import MyInput from '@/components/MyInput.vue'
import MyBtn from '@/components/MyBtn.vue'

const ui = useUiStore()
const authStore = useAuthStore()

const formFields = LOGIN_FIELDS

const form = ref<LoginForm>(prepareForm())

const snapshot = prepareForm()
const formIsDirty = computed(() => !isEqual(snapshot, form.value))

const serverErrors = ref<Maybe<Partial<Record<keyof LoginForm | 'server', string>>>>(null)

const validation = computed<Partial<Record<keyof LoginForm, true | string>>>(() => {
  if (!formIsDirty.value) return {}

  const valid = {
    email: checkEmail(form.value.email),
    password: checkEmptiness(form.value.password) || 'Password is required.',
  }
  const errors = serverErrors.value ?? {}

  Object.entries(valid).forEach(([key, value]) => {
    if (value !== true) return

    const k = key as keyof LoginForm

    if (errors[k] || errors.server) {
      valid[k] = `Server: ${errors[k] ?? errors.server}`
    } else {
      valid[k] = true
    }
  })

  return valid
})

const formIsDisabled = computed(() => ui.isLoading)
const btnIsDisabled = computed(
  () =>
    formIsDisabled.value ||
    !formIsDirty.value ||
    !Object.entries(validation.value).every(([, valid]) => valid === true),
)

watch(
  () => form.value,
  () => {
    if (!serverErrors.value) return

    resetValidation()
  },
  { deep: true },
)

const router = useRouter()

async function login() {
  if (btnIsDisabled.value) return

  serverErrors.value = await authStore.login(
    form.value.email as string,
    form.value.password as string,
  )

  if (!serverErrors.value) router.push({ name: 'home' })
}

function prepareForm() {
  return Object.keys(formFields).reduce((acc, key) => {
    const k = key as keyof typeof formFields

    acc[k] = formFields[k].defaultValue ?? null

    return acc
  }, {} as LoginForm)
}

function reset() {
  form.value = prepareForm()
  resetValidation()
}

function resetValidation() {
  serverErrors.value = null
}

onBeforeRouteLeave(() => queueMicrotask(reset))
</script>

<template>
  <div class="flex flex-row items-center justify-center min-h-screen">
    <MyPageWrapper class="!my-5 lg:!my-10 max-w-lg w-full mx-5 lg:mx-10">
      <MyHeading class="text-center pb-2 mb-2 lg:mb-4">Login</MyHeading>

      <form id="login" novalidate class="w-full" @submit.prevent="login">
        <template v-for="(field, key) in formFields" :key="key">
          <MyInput
            v-model="form[key]"
            :name="key"
            :label="field.label"
            :type="getType(key, formFields)"
            :disabled="formIsDisabled"
            :validation="validation[key]"
            :autocomplete="field.autocomplete"
          />
        </template>

        <div class="flex justify-end mt-7 lg:mt-8">
          <MyBtn primary title="Enter" type="submit" :disabled="btnIsDisabled">Enter</MyBtn>
        </div>
      </form>
    </MyPageWrapper>
  </div>
</template>
