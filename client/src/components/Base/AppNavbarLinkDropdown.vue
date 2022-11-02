<script setup lang="ts">
import type { StyledNavigationBarLinkGroup } from "@/types";
import type { PropType } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

defineProps({
  item: {
    type: Object as PropType<StyledNavigationBarLinkGroup>,
    required: true,
  },
  position: {
    type: String as PropType<
      "topRight" | "topLeft" | "bottomRight" | "bottomLeft"
    >,
    default: "bottomRight",
  },
  icon: Boolean,
  badge: Boolean,
});
</script>

<template>
  <Menu as="div" class="relative">
    <div>
      <MenuButton
        class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <component
          v-if="icon"
          :is="item.icon"
          :class="['-ml-1 mr-3 h-6 w-6 flex-shrink-0']"
          aria-hidden="true"
        />
        <span class="truncate">{{ item.name }}</span>
        <span
          v-if="badge && item.count"
          :class="['ml-auto inline-block rounded-full py-0.5 px-3 text-xs']"
          >{{ item.count }}</span
        >
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute z-10 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700"
        :class="{
          'right-0 mt-2 origin-top-right': position === 'bottomLeft',
          'left-0 mt-2 origin-top-left': position === 'bottomRight',
          'bottom-full right-0 mb-2 origin-bottom-right':
            position === 'topLeft',
          'left-0 bottom-full mb-2 origin-bottom-left': position === 'topRight',
        }"
      >
        <router-link
          v-for="(subItem, subItemIndex) in item.children"
          :key="subItemIndex"
          :to="subItem.to"
          custom
          #="{ href, navigate }"
        >
          <MenuItem v-slot="{ active }" @click="navigate">
            <a
              :href="href"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-900' : '',
                'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white',
              ]"
            >
              {{ subItem.name }}
            </a>
          </MenuItem>
        </router-link>
      </MenuItems>
    </transition>
  </Menu>
</template>
