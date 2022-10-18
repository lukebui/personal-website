<script setup lang="ts">
import { useUserStore } from "@/store/users";
import { RouteNames } from "@/utils";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";

const textFromServer = ref("");

onBeforeMount(async () => {
  textFromServer.value = await (await fetch("http://localhost:3000")).text();
});

const userStore = useUserStore();
const router = useRouter();

const signOut = () => {
  userStore.removeUser();

  router.push({ name: RouteNames.SIGN_IN });
};
</script>

<template>
  <header>
    <nav class="flex p-2">
      <div class="flex-grow"></div>
      <AppButton @click="signOut"> Sign Out </AppButton>
    </nav>
  </header>
  <main>
    <div class="container mx-auto">
      {{ textFromServer }}
    </div>
  </main>
</template>
