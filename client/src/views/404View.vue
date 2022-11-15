<script setup lang="ts">
import { AppLayouts, RouteNames } from "@/enums";
import { useSystemStore } from "@/store/system";

const { setLayout } = useSystemStore();

setLayout(AppLayouts.EMPTY);
</script>

<template>
  <div class="mx-auto max-w-max px-4 sm:px-6 lg:px-8">
    <main class="sm:flex">
      <p class="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">
        404
      </p>
      <div class="sm:ml-6">
        <div class="space-y-2 sm:border-l sm:border-gray-200 sm:pl-6">
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
          >
            Page not found
          </h1>
          <p class="text-base text-gray-500">
            Please check the URL in the address bar and try again.
          </p>
        </div>
        <div
          class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6"
        >
          <router-link
            :to="{ name: RouteNames.HOME }"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >Go back home</router-link
          >
        </div>
      </div>
    </main>
  </div>
</template>
