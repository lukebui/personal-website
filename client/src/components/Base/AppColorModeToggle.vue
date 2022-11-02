<script setup lang="ts">
import { useColorMode } from "@/composables";
import AppButton from "./AppButton.vue";

import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

const { colorMode, toggleColorMode } = useColorMode();
</script>

<template>
  <AppButton @click="toggleColorMode" round>
    <MoonIcon v-if="colorMode === 'dark'" class="h-6 w-6" />
    <SunIcon v-else class="h-6 w-6" />
  </AppButton>
</template>
