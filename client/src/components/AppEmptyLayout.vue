<script setup lang="ts">
import TheColorModeToggle from "./AppColorModeToggle.vue";
</script>

<template>
  <div class="flex h-screen w-screen flex-wrap">
    <header class="w-full">
      <nav
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8"
      >
        <div>&nbsp;</div>
        <TheColorModeToggle />
      </nav>
    </header>
    <main class="w-full">
      <slot></slot>
    </main>
  </div>
</template>
