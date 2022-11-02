<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import TheColorModeToggle from "../Base/AppColorModeToggle.vue";
import TheProfileDropdown from "../Base/AppProfileDropdown.vue";
import AppVerticalNavbar from "../Base/AppVerticalNavbar.vue";
import { useSystemStore } from "@/store/system";

const systemStore = useSystemStore();

const navigation = computed(() => {
  return systemStore.navLinks;
});
const sidebarOpen = ref(false);
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        class="relative z-40 md:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel
              class="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800"
            >
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <div class="flex flex-shrink-0 items-center px-4">
                  <!-- Place logo here -->
                </div>
                <div class="mt-5 px-2">
                  <AppVerticalNavbar
                    :navigation="navigation"
                    @navigate="sidebarOpen = false"
                  />
                </div>
              </div>
              <div class="flex flex-shrink-0 gap-2 p-4">
                <TheProfileDropdown position="topRight"></TheProfileDropdown>
                <TheColorModeToggle />
              </div>
            </DialogPanel>
          </TransitionChild>
          <div class="w-14 flex-shrink-0">
            <!-- Force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex min-h-0 flex-1 flex-col bg-white shadow dark:border-r dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
      >
        <div class="flex flex-1 flex-col space-y-5 overflow-y-auto pt-5 pb-4">
          <!-- <div class="flex flex-shrink-0 items-center px-4">
            Place logo here
          </div> -->
          <div class="flex-1 px-2">
            <AppVerticalNavbar :navigation="navigation" icon badge />
          </div>
        </div>
        <div class="flex flex-shrink-0 gap-2 p-2">
          <TheProfileDropdown position="topRight"></TheProfileDropdown>
          <TheColorModeToggle />
        </div>
      </div>
    </div>
    <div class="flex flex-1 flex-col md:pl-64">
      <div
        class="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 dark:bg-gray-900 sm:pl-3 sm:pt-3 md:hidden"
      >
        <button
          type="button"
          class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
