<script setup lang="ts">
import { RouterView } from "vue-router";
import { StyledNavigationLink, StyledNavigationBarLinkGroup } from "./types";
import { RouteNames } from "./enums";
import { useSystemStore } from "@/store/system";

const links: (StyledNavigationLink | StyledNavigationBarLinkGroup)[] = [
  new StyledNavigationLink("Home", { name: RouteNames.HOME }),
  new StyledNavigationLink("Contacts", { name: RouteNames.CONTACTS }),
  new StyledNavigationLink("References", { name: RouteNames.REFERENCES }),
];

const systemStore = useSystemStore();

systemStore.setNavLinks(links);
</script>

<template>
  <RouterView />
</template>
