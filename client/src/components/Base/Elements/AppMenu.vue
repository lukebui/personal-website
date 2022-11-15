<script setup lang="ts">
import type { MenuAction } from "@/types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useElementBounding, useWindowSize } from "@vueuse/core";
import { computed, ref, type PropType } from "vue";
import AppButton from "./AppButton.vue";
import AppLink from "./AppLink.vue";

defineProps({
  title: String,
  actions: Array as PropType<MenuAction[]>,
});

const isFunction = (action: MenuAction) => {
  return typeof action.action === "function";
};

const menuItems = ref(null);

const windowSize = useWindowSize();

const menuItemsBounding = useElementBounding(menuItems);

const menuItemsPosition = computed(() => {
  let top = false;
  let right = false;

  if (menuItemsBounding.left.value < 0) {
    right = true;
  }

  if (menuItemsBounding.bottom.value > windowSize.height.value) {
    top = true;
  }

  if (top && right) {
    return "top-right";
  } else if (top && !right) {
    return "top-left";
  } else if (!top && right) {
    return "bottom-right";
  } else {
    return "bottom-left";
  }
});
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
        class="absolute z-10 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
        :class="{
          'right-0 mt-2 origin-top-right': menuItemsPosition === 'bottom-left',
          'left-0 mt-2 origin-top-left': menuItemsPosition === 'bottom-right',
          'right-0 bottom-full mb-2 origin-bottom-right':
            menuItemsPosition === 'top-left',
          'left-0 bottom-full mb-2 origin-bottom-left':
            menuItemsPosition === 'top-right',
        }"
      >
        <div ref="menuItems" class="py-1">
          <MenuItem
            v-for="(action, actionIndex) in actions"
            :key="actionIndex"
            v-slot="{ active }"
          >
            <button
              v-if="isFunction(action)"
              :class="[
                active
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'
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
