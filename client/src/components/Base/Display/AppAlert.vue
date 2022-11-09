<script setup lang="ts">
import {
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/20/solid";
import { computed, toRefs, type Component, type PropType } from "vue";

const props = defineProps({
  status: {
    type: String as PropType<"success" | "error" | "warning" | "info">,
    default: "info",
  },
  messages: Array as PropType<string[]>,
  title: String,
});

const { status } = toRefs(props);

const statusSymbol = computed(() => {
  let icon: Component;

  switch (status.value) {
    case "success":
      icon = CheckCircleIcon;
      break;
    case "error":
      icon = XCircleIcon;
      break;
    case "warning":
      icon = ExclamationTriangleIcon;
      break;
    case "info":
      icon = InformationCircleIcon;
      break;
  }

  return icon;
});
</script>

<template>
  <div
    class="rounded-md p-4"
    :class="{
      'bg-green-50 dark:bg-green-900': status === 'success',
      'bg-red-50 dark:bg-red-900': status === 'error',
      'bg-amber-50 dark:bg-amber-900': status === 'warning',
      'bg-cyan-50 dark:bg-cyan-900': status === 'info',
    }"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <component
          :is="statusSymbol"
          class="h-5 w-5"
          :class="{
            'text-green-400 dark:text-green-500': status === 'success',
            'text-red-400 dark:text-red-500': status === 'error',
            'text-amber-400 dark:text-amber-500': status === 'warning',
            'text-cyan-400 dark:text-cyan-500': status === 'info',
          }"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <h3
          v-if="title"
          class="text-sm font-medium"
          :class="{
            'text-green-800 dark:text-green-200': status === 'success',
            'text-red-800 dark:text-red-200': status === 'error',
            'text-amber-800 dark:text-amber-200': status === 'warning',
            'text-cyan-800 dark:text-cyan-200': status === 'info',
          }"
        >
          {{ title }}
        </h3>
        <div
          v-if="messages && messages.length"
          class="mt-2 text-sm"
          :class="{
            'text-green-700 dark:text-green-200': status === 'success',
            'text-red-700 dark:text-red-200': status === 'error',
            'text-amber-700 dark:text-amber-200': status === 'warning',
            'text-cyan-700 dark:text-cyan-200': status === 'info',
          }"
        >
          <ul
            v-if="messages.length > 1"
            role="list"
            class="list-disc space-y-1 pl-5"
          >
            <li v-for="(message, messageIndex) in messages" :key="messageIndex">
              {{ message }}
            </li>
          </ul>
          <p v-else>{{ messages[0] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
