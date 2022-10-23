<script setup lang="ts">
import { NavigationBarLink, NavigationBarLinkGroup } from "@/utils";
import type { PropType } from "vue";
import AppLink from "./AppLink.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

defineProps({
  navigation: {
    type: Array as PropType<(NavigationBarLink | NavigationBarLinkGroup)[]>,
  },
  icon: Boolean,
  badge: Boolean,
});
</script>

<template>
  <nav class="space-y-1" aria-label="Sidebar">
    <template v-for="item in navigation" :key="item.name">
      <div v-if="item instanceof NavigationBarLink">
        <AppLink
          :to="item.to"
          active-class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
          inactive-class="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
          class="group flex items-center rounded-md py-2 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>
      <Disclosure as="div" v-else class="space-y-1" v-slot="{ open }">
        <DisclosureButton
          :class="[
            open
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
            'group flex items-center rounded-md py-2 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500',
          ]"
        >
          <component
            v-if="icon"
            :is="item.icon"
            :class="[
              open
                ? 'text-gray-500 dark:text-white'
                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white',
              '-ml-1 mr-3 h-6 w-6 flex-shrink-0',
            ]"
            aria-hidden="true"
          />
          <span class="flex-1 truncate">{{ item.name }}</span>
          <span
            v-if="badge && item.count"
            :class="[
              open
                ? 'bg-white dark:bg-gray-700'
                : 'bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-900 dark:group-hover:bg-gray-800',
              'ml-auto inline-block rounded-full py-0.5 px-3 text-xs',
            ]"
            >{{ item.count }}</span
          >
          <svg
            :class="[
              open ? 'rotate-90 text-gray-400' : 'text-gray-300',
              'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400',
            ]"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
          </svg>
        </DisclosureButton>
        <DisclosurePanel class="space-y-1">
          <DisclosureButton
            v-for="subItem in item.children"
            :key="subItem.name"
            as="template"
          >
            <AppLink
              :to="subItem.to"
              active-class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
              inactive-class="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              class="group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {{ subItem.name }}
            </AppLink>
          </DisclosureButton>
        </DisclosurePanel>
      </Disclosure>
    </template>
  </nav>
</template>
