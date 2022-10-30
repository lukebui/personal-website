<script setup lang="ts">
import type { ComponentColor } from "@/enums";
import type { NavigationLink } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import type { PropType } from "vue";
import AppButton from "./AppButton.vue";
import AppLink from "./AppLink.vue";

defineProps({
  breadcrumbs: {
    type: Array as PropType<NavigationLink[]>,
    default: () => [],
  },
  actions: {
    type: Array as PropType<
      { name: string; action: () => void; color?: ComponentColor }[]
    >,
  },
  title: String,
});
</script>

<template>
  <div class="space-y-2">
    <div v-if="breadcrumbs.length > 1">
      <nav class="sm:hidden" aria-label="Back">
        <AppLink
          :to="breadcrumbs[breadcrumbs.length - 2].to"
          class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-hidden="true"
        >
          <ChevronLeftIcon
            class="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          Back
        </AppLink>
      </nav>
      <nav class="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" class="flex items-center space-x-4">
          <li v-for="(item, itemIndex) in breadcrumbs" :key="itemIndex">
            <div class="flex" :class="{ 'items-center': itemIndex > 0 }">
              <ChevronRightIcon
                v-if="itemIndex > 0"
                class="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              <AppLink
                :to="item.to"
                class="rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                inactive-class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                active-class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                exact-active-class="text-sm font-medium text-indigo-600 dark:text-indigo-500"
                :class="{
                  'ml-4': itemIndex > 0,
                }"
              >
                {{ item.name }}
              </AppLink>
            </div>
          </li>
        </ol>
      </nav>
    </div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2
          class="pb-1 text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          {{ title }}
        </h2>
      </div>
      <div class="mt-2 flex flex-shrink-0 gap-3 md:mt-0 md:ml-4">
        <AppButton
          v-for="(action, actionIndex) in actions"
          :key="actionIndex"
          @click="action.action"
          :color="action.color"
          :outline="!action.color"
        >
          {{ action.name }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
