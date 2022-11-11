<script setup lang="ts">
import { AppColorModeToggle } from "@/components/Base";
import { onBeforeMount, onUnmounted } from "vue";

onBeforeMount(() => {
  document.documentElement.classList.add("h-full");
  document.body.classList.add("h-full");
});

onUnmounted(() => {
  document.documentElement.classList.remove("h-full");
  document.body.classList.remove("h-full");
});
</script>

<template>
  <div class="flex h-screen w-screen flex-wrap">
    <header class="w-full">
      <nav
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8"
      >
        <div>&nbsp;</div>
        <AppColorModeToggle />
      </nav>
    </header>
    <main class="w-full">
      <slot></slot>
    </main>
  </div>
</template>
