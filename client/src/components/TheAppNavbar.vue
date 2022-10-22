<script setup lang="ts">
import { ComponentSize } from "@/utils";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import AppButton from "./AppButton.vue";
import { useUserStore } from "@/store/users";
import { RouteNames } from "@/utils";
import { useRouter, type RouteLocationRaw, RouterLink } from "vue-router";
import TheColorModeToggle from "./TheColorModeToggle.vue";

const navigation: { name: string; to: RouteLocationRaw }[] = [
  { name: "Home", to: { name: RouteNames.HOME } },
  { name: "About", to: { path: "/about" } },
];

const userStore = useUserStore();
const router = useRouter();

const signOut = () => {
  userStore.removeUser();

  router.push({ name: RouteNames.SIGN_IN });
};
</script>

<template>
  <Disclosure
    as="nav"
    class="bg-white shadow dark:border-b dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
    v-slot="{ open }"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex flex-shrink-0 items-center">
            <!-- Place logo here -->
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                v-for="(item, itemIndex) in navigation"
                :key="itemIndex"
                :to="item.to"
                custom
                #="{ isActive, href, navigate }"
              >
                <a
                  @click="navigate"
                  :href="href"
                  :class="[
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  ]"
                  :aria-current="isActive ? 'page' : undefined"
                  >{{ item.name }}</a
                >
              </RouterLink>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <TheColorModeToggle />

          <!-- Profile dropdown -->
          <Menu as="div" class="relative">
            <div>
              <MenuButton as="template">
                <AppButton round :size="ComponentSize.SMALL">
                  <span class="sr-only">Open user menu</span>
                  <!-- <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  /> -->
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
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700"
              >
                <!-- <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    >Your Profile</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    >Settings</a
                  >
                </MenuItem> -->
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
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="(item, itemIndex) in navigation"
          :key="itemIndex"
          as="div"
        >
          <RouterLink :to="item.to" custom #="{ isActive, href, navigate }">
            <a
              @click="navigate"
              :href="href"
              :class="[
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                'block rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500',
              ]"
              :aria-current="isActive ? 'page' : undefined"
            >
              {{ item.name }}
            </a>
          </RouterLink>
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
