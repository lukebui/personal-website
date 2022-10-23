<script setup lang="ts">
import { ComponentSize, RouteNames } from "@/enums";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import AppButton from "./AppButton.vue";
import { useUserStore } from "@/store/users";
import { useRouter } from "vue-router";
import type { PropType } from "vue";

defineProps({
  position: {
    type: String as PropType<
      "topRight" | "topLeft" | "bottomRight" | "bottomLeft"
    >,
    default: "bottomRight",
  },
});

const userStore = useUserStore();
const router = useRouter();

const signOut = () => {
  userStore.removeUser();

  router.push({ name: RouteNames.SIGN_IN });
};
</script>

<template>
  <Menu as="div" class="relative">
    <div>
      <MenuButton as="template">
        <AppButton round :size="ComponentSize.SMALL">
          <span class="sr-only">Open user menu</span>
          <UserCircleIcon class="h-6 w-6" />
        </AppButton>
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
        <MenuItem v-slot="{ active }">
          <button
            :class="[
              active ? 'bg-gray-100 dark:bg-gray-900' : '',
              'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white',
            ]"
            @click="signOut"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
