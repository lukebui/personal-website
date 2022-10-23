<script setup lang="ts">
import { RouterView } from "vue-router";
import { NavigationBarLink, NavigationBarLinkGroup } from "./utils";
import { RouteNames } from "./enums";
import { useSystemStore } from "@/store/system";

const links: (NavigationBarLink | NavigationBarLinkGroup)[] = [
  new NavigationBarLink("Home", { name: RouteNames.HOME }),
  new NavigationBarLink("Contacts", { name: RouteNames.CONTACTS }),
];

const systemStore = useSystemStore();

systemStore.setNavLinks(links);
</script>

<template>
  <RouterView />
</template>
