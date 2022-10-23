<script setup lang="ts">
import TheAppNavbar from "./AppNavbar.vue";
</script>

<template>
  <div class="h-full w-full">
    <header>
      <TheAppNavbar></TheAppNavbar>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>
