<script setup lang="ts">
import { ComponentSize } from "@/utils";
import { useColorMode } from "@/composables";
import AppButton from "./AppButton.vue";

import { SunIcon, MoonIcon, Cog8ToothIcon } from "@heroicons/vue/24/solid";

const { colorMode, toggleColorMode } = useColorMode();
</script>

<template>
  <div class="flex h-screen w-screen flex-wrap">
    <header class="w-full">
      <nav
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8"
      >
        <div>&nbsp;</div>
        <AppButton @click="toggleColorMode" :size="ComponentSize.X_SMALL">
          <SunIcon v-if="colorMode === 'light'" class="h-4 w-4" />
          <MoonIcon v-else-if="colorMode === 'dark'" class="h-4 w-4" />
          <Cog8ToothIcon v-else-if="colorMode === 'auto'" class="h-4 w-4" />
        </AppButton>
      </nav>
    </header>
    <main class="w-full">
      <slot></slot>
    </main>
  </div>
</template>
