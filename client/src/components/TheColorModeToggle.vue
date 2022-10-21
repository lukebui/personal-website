<script setup lang="ts">
import { useColorMode } from "@/composables";
import AppButton from "./AppButton.vue";

import { SunIcon, MoonIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";

const { colorMode, toggleColorMode } = useColorMode();
</script>

<template>
  <AppButton @click="toggleColorMode" round>
    <SunIcon v-if="colorMode === 'light'" class="h-6 w-6" />
    <MoonIcon v-else-if="colorMode === 'dark'" class="h-6 w-6" />
    <Cog6ToothIcon v-else-if="colorMode === 'auto'" class="h-6 w-6" />
  </AppButton>
</template>
