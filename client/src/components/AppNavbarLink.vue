<script setup lang="ts">
import type { NavigationBarLink } from "@/types";
import type { PropType } from "vue";
import AppLink from "./AppLink.vue";

defineProps({
  item: {
    type: Object as PropType<NavigationBarLink>,
    required: true,
  },
  icon: Boolean,
  badge: Boolean,
});
</script>

<template>
  <AppLink
    :to="item.to"
    active-class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
    inactive-class="text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
    class="flex items-center rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
    #="{ isActive }"
  >
    <component
      v-if="icon"
      :is="item.icon"
      :class="[
        isActive
          ? 'text-gray-500 dark:text-white'
          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white',
        '-ml-1 mr-3 h-6 w-6 flex-shrink-0',
      ]"
      aria-hidden="true"
    />
    <span class="truncate">{{ item.name }}</span>
    <span
      v-if="badge && item.count"
      :class="[
        isActive
          ? 'bg-white dark:bg-gray-700'
          : 'bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-900 dark:group-hover:bg-gray-800',
        'ml-auto inline-block rounded-full py-0.5 px-3 text-xs',
      ]"
      >{{ item.count }}</span
    >
  </AppLink>
</template>
