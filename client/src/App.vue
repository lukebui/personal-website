<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div
    :class="[
      'h-screen w-screen overflow-hidden bg-white dark:bg-gray-800 dark:text-white',
    ]"
  >
    <div class="h-full w-full overflow-auto">
      <RouterView />
    </div>
  </div>
</template>
