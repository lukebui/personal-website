<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const textFromServer = ref("");

onBeforeMount(async () => {
  textFromServer.value = await (await fetch("http://localhost:3000")).text();
});
</script>

<template>
  <main>
    {{ textFromServer }}
  </main>
</template>
