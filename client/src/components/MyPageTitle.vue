<script setup lang="ts">
import MyHeading from '@/components/MyHeading.vue'
</script>

<template>
  <div class="flex items-end justify-between mb-5 lg:mb-10">
    <MyHeading>
      <slot name="title" />
    </MyHeading>

    <div
      v-if="$slots.actions"
      class="flex justify-end flex-wrap mb-2 ml-2 md:mb-3 lg:mb-4 lg:ml-4 gap-2 lg:gap-4"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
