<script setup lang="ts">
import type { NavigationBarLink, NavigationBarLinkGroup } from "@/types";
import type { PropType } from "vue";
import AppVerticalNavbarItem from "./AppVerticalNavbarItem.vue";

defineProps({
  navigation: {
    type: Array as PropType<(NavigationBarLink | NavigationBarLinkGroup)[]>,
  },
  icon: Boolean,
  badge: Boolean,
});

defineEmits(["navigate"]);
</script>

<template>
  <nav class="space-y-1" aria-label="Sidebar">
    <AppVerticalNavbarItem
      v-for="item in navigation"
      :key="item.name"
      :item="item"
      @navigate="$emit('navigate')"
      :icon="icon"
      :badge="badge"
    />
  </nav>
</template>
