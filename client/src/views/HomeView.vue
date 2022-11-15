<script setup lang="ts">
import { AppLayouts } from "@/enums";
import { useSystemStore } from "@/store/system";

const { setLayout } = useSystemStore();

setLayout(AppLayouts.DEFAULT);
</script>

<template>
  <div class="container mx-auto px-2 py-10 sm:px-6 lg:px-8">Home page</div>
</template>
