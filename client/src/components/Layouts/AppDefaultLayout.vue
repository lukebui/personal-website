<script setup lang="ts">
import { useSystemStore } from "@/store/system";
import { computed } from "vue";
import { AppNavbar } from "@/components/Base";

const systemStore = useSystemStore();

const navigation = computed(() => {
  return systemStore.navLinks;
});
</script>

<template>
  <div class="h-full w-full">
    <header>
      <AppNavbar :navigation="navigation" icon badge></AppNavbar>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>
