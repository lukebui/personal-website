<script setup lang="ts">
import type { Component, FunctionalComponent, PropType } from "vue";

defineProps({
  icon: [Object, Function] as PropType<Component | FunctionalComponent>,
  title: String,
});
</script>

<template>
  <button
    type="button"
    class="group relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:border-gray-500 dark:focus:ring-offset-gray-900"
  >
    <component
      v-if="icon"
      :is="icon"
      class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300 dark:group-hover:text-white"
      aria-hidden="true"
    />
    <span
      v-if="title"
      class="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
      >{{ title }}</span
    >
  </button>
</template>
