<script setup lang="ts">
import { BookOpenIcon, HomeIcon } from "@heroicons/vue/24/solid";
import { RouterView } from "vue-router";
import AppVerticalNavigationLayout from "./components/AppVerticalNavigationLayout.vue";
import { RouteNames, NavigationBarLink, NavigationBarLinkGroup } from "./utils";

const navigation: (NavigationBarLink | NavigationBarLinkGroup)[] = [
  new NavigationBarLink("Home", { name: RouteNames.HOME }, false, HomeIcon),
  new NavigationBarLink(
    "Contacts",
    { name: RouteNames.CONTACTS },
    false,
    BookOpenIcon
  ),
];
</script>

<template>
  <AppVerticalNavigationLayout :navigation="navigation">
    <RouterView />
  </AppVerticalNavigationLayout>
</template>
