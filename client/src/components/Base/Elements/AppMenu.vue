<script setup lang="ts">
import type { MenuAction } from "@/types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import type { PropType } from "vue";
import AppButton from "./AppButton.vue";
import AppLink from "./AppLink.vue";

defineProps({
  title: String,
  actions: Array as PropType<MenuAction[]>,
});

const isFunction = (action: MenuAction) => {
  return typeof action.action === "function";
};
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton as="div" ref="menuButton">
      <slot name="button">
        <AppButton>
          {{ title }}
        </AppButton>
      </slot>
    </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900"
      >
        <div class="py-1">
          <MenuItem
            v-for="(action, actionIndex) in actions"
            :key="actionIndex"
            v-slot="{ active }"
          >
            <button
              v-if="isFunction(action)"
              :class="[
                active
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300',
                'block w-full px-4 py-2 text-left text-sm',
              ]"
              @click="action.action"
            >
              {{ action.text }}
            </button>
            <AppLink
              v-else
              :to="action.action"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
            >
              {{ action.text }}
            </AppLink>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
