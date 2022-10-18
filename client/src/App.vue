<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useSystemStore } from "./store/system";

const systemStore = useSystemStore();

onMounted(() => {
  systemStore.loadDarkMode();
});

document.addEventListener("visibilitychange", () => {
  systemStore.loadDarkMode();
});
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
