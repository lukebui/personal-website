<script setup lang="ts">
import { ComponentColor, ComponentSize } from "@/enums";
import type { NavigationLink } from "@/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed, toRefs, type Component, type PropType } from "vue";
import AppButton from "../Elements/AppButton.vue";
import AppLink from "../Elements/AppLink.vue";

const props = defineProps({
  breadcrumbs: {
    type: Array as PropType<NavigationLink[]>,
    default: () => [],
  },
  actions: {
    type: Array as PropType<
      { name: string; action: () => void; primary: boolean }[]
    >,
  },
  closeAction: {
    type: Function as PropType<() => void>,
  },
  title: String,
  meta: {
    type: [String, Array] as PropType<
      string | { icon: Component; text: string }[]
    >,
  },
});

const { actions } = toRefs(props);

const primaryActions = computed(() => {
  return actions?.value?.filter((action) => action.primary);
});

const secondaryActions = computed(() => {
  return actions?.value?.filter((action) => !action.primary);
});
</script>

<template>
  <div class="flex items-start gap-2">
    <div class="flex-grow space-y-2">
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
                  class="rounded px-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  inactive-class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  active-class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  exact-active-class="text-sm font-medium text-indigo-600 dark:text-indigo-500"
                  :class="{
                    'ml-3': itemIndex > 0,
                    '-mx-1': itemIndex === 0,
                  }"
                >
                  <span class="">
                    {{ item.name }}
                  </span>
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
          <template v-if="meta">
            <div class="mt-1">
              <p
                v-if="typeof meta === 'string'"
                class="text-sm text-gray-700 dark:text-gray-400"
              >
                {{ meta }}
              </p>
              <div
                v-else
                class="flex flex-col gap-y-2 sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-x-6"
              >
                <div
                  v-for="(info, infoIndex) in meta"
                  :key="infoIndex"
                  class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-300"
                >
                  <component
                    :is="info.icon"
                    class="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                  {{ info.text }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="mt-1 flex flex-shrink-0 gap-3 md:mt-0 md:ml-4">
          <AppButton
            v-for="(action, actionIndex) in secondaryActions"
            :key="actionIndex"
            @click="action.action"
            class="hidden sm:block"
            outline
          >
            {{ action.name }}
          </AppButton>

          <AppButton
            v-for="(action, actionIndex) in primaryActions"
            :key="actionIndex"
            @click="action.action"
            :color="ComponentColor.PRIMARY"
          >
            {{ action.name }}
          </AppButton>

          <Menu
            v-if="secondaryActions?.length"
            as="div"
            class="relative ml-3 sm:hidden"
          >
            <MenuButton as="template">
              <AppButton outline>
                More
                <ChevronDownIcon
                  class="-mr-1 ml-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
              </AppButton>
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute left-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700"
              >
                <MenuItem
                  v-for="(action, actionIndex) in secondaryActions"
                  :key="actionIndex"
                  v-slot="{ active }"
                  @click="action.action"
                >
                  <button
                    :class="[
                      active ? 'bg-gray-100 dark:bg-gray-900' : '',
                      'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white',
                    ]"
                  >
                    {{ action.name }}
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
    <AppButton
      v-if="closeAction"
      @click="closeAction"
      round
      :size="ComponentSize.SMALL"
    >
      <XMarkIcon class="h-5 w-5" />
    </AppButton>
  </div>
</template>
