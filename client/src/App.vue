<script setup lang="ts"></script>

<template>
  <div class="min-h-screen font-roboto text-gray-800 bg-white">
    <router-view name="header" />

    <main
      class="mx-auto mt-20 max-w-7xl rounded-lg border border-gray-100 bg-white p-10 shadow-xl shadow-blue-50"
    >
      <router-view />
    </main>
  </div>
</template>
