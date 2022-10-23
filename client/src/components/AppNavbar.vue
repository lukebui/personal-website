<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import type { NavigationBarLink, NavigationBarLinkGroup } from "@/utils";
import TheColorModeToggle from "./AppColorModeToggle.vue";
import TheProfileDropdown from "./AppProfileDropdown.vue";
import type { PropType } from "vue";
import { useCheckNavigationLink } from "@/composables";
import AppNavbarLink from "./AppNavbarLink.vue";
import AppNavbarLinkDropdown from "./AppNavbarLinkDropdown.vue";
import AppVerticalNavbar from "./AppVerticalNavbar.vue";

defineProps({
  navigation: {
    type: Array as PropType<(NavigationBarLink | NavigationBarLinkGroup)[]>,
  },
  icon: Boolean,
  badge: Boolean,
});

const { isLink } = useCheckNavigationLink();
</script>

<template>
  <Disclosure
    as="nav"
    class="bg-white shadow dark:border-b dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
    v-slot="{ open, close }"
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
              <template v-for="(item, itemIndex) in navigation">
                <AppNavbarLink
                  v-if="isLink(item)"
                  :key="`${itemIndex}-link`"
                  :item="item"
                  :icon="icon"
                  :badge="badge"
                />
                <AppNavbarLinkDropdown
                  v-else
                  :key="`${itemIndex}-dropdown`"
                  :item="item"
                  :icon="icon"
                  :badge="badge"
                />
              </template>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <TheColorModeToggle />

          <TheProfileDropdown position="bottomLeft" />
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <AppVerticalNavbar
          :navigation="navigation"
          @navigate="close"
          :icon="icon"
          :badge="badge"
        />
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
