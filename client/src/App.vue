<script setup lang="ts">
import { RouterView } from "vue-router";
import { StyledNavigationLink, StyledNavigationBarLinkGroup } from "./types";
import { AppLayouts, RouteNames } from "./enums";
import { useSystemStore } from "@/store/system";
import { computed, type Component } from "vue";
import AppEmptyLayout from "./components/Layouts/AppEmptyLayout.vue";
import AppVerticalNavigationLayout from "./components/Layouts/AppVerticalNavigationLayout.vue";
import AppDefaultLayout from "./components/Layouts/AppDefaultLayout.vue";

const links: (StyledNavigationLink | StyledNavigationBarLinkGroup)[] = [
  new StyledNavigationLink("Contacts", { name: RouteNames.CONTACTS }),
  new StyledNavigationLink("References", { name: RouteNames.REFERENCES }),
];

const systemStore = useSystemStore();

systemStore.setNavLinks(links);

const layout = computed(() => {
  let thisLayout: Component;

  switch (systemStore.layout) {
    case AppLayouts.DEFAULT:
      thisLayout = AppDefaultLayout;
      break;
    case AppLayouts.EMPTY:
      thisLayout = AppEmptyLayout;
      break;
    case AppLayouts.VERTICAL_NAV:
      thisLayout = AppVerticalNavigationLayout;
      break;
  }

  return thisLayout;
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
