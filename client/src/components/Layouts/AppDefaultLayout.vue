<script setup lang="ts">
import { useSystemStore } from "@/store/system";
import { computed } from "vue";
import TheAppNavbar from "../Base/AppNavbar.vue";

const systemStore = useSystemStore();

const navigation = computed(() => {
  return systemStore.navLinks;
});
</script>

<template>
  <div class="h-full w-full">
    <header>
      <TheAppNavbar :navigation="navigation" icon badge></TheAppNavbar>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>
