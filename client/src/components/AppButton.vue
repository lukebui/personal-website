<script setup lang="ts">
import { ButtonType, ComponentColor, ComponentSize } from "@/enums";
import type { PropType } from "vue";

defineProps({
  color: {
    type: String as PropType<ComponentColor>,
  },
  type: {
    type: String as PropType<ButtonType>,
    default: ButtonType.BUTTON,
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: ComponentSize.MEDIUM,
  },
  round: Boolean,
  outline: Boolean,
  disabled: Boolean,
  block: Boolean,
});
</script>

<template>
  <button
    :type="type"
    class="items-center border font-medium focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
    :class="{
      block: block,
      'inline-flex': !block,

      'bg-transparent text-gray-900 shadow-none backdrop-blur-lg hover:backdrop-brightness-90 focus:ring-indigo-500 focus:ring-offset-0  disabled:hover:backdrop-brightness-100 dark:text-white dark:hover:backdrop-brightness-150 dark:focus:ring-indigo-500 dark:focus:ring-offset-0 dark:disabled:hover:backdrop-brightness-100':
        color === undefined,

      'border-transparent': color === undefined && !outline,
      'border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-indigo-600':
        color === ComponentColor.PRIMARY && !outline,
      'border-transparent bg-gray-500 text-white shadow-sm hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-gray-500':
        color === ComponentColor.SECONDARY && !outline,
      'border-transparent bg-cyan-600 text-white shadow-sm hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-cyan-600':
        color === ComponentColor.INFO && !outline,
      'border-transparent bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-green-600':
        color === ComponentColor.SUCCESS && !outline,
      'border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-red-600':
        color === ComponentColor.ERROR && !outline,
      'border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-600 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-amber-500':
        color === ComponentColor.WARNING && !outline,

      'border-gray-400 dark:border-white': color === undefined && outline,
      'border-indigo-600 bg-transparent text-indigo-600 shadow-sm hover:bg-indigo-100 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-transparent dark:border-indigo-500 dark:text-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white dark:disabled:text-indigo-500 dark:disabled:hover:bg-transparent':
        color === ComponentColor.PRIMARY && outline,
      'border-gray-500 bg-transparent text-gray-500 shadow-sm hover:bg-gray-100 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-white dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-white dark:disabled:text-gray-300 dark:disabled:hover:bg-transparent':
        color === ComponentColor.SECONDARY && outline,
      'border-cyan-600 bg-transparent text-cyan-600 shadow-sm hover:bg-cyan-100 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-transparent dark:hover:bg-cyan-600 dark:hover:text-white dark:disabled:text-cyan-600 dark:disabled:hover:bg-transparent':
        color === ComponentColor.INFO && outline,
      'border-green-600 bg-transparent text-green-600 shadow-sm hover:bg-green-100 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-transparent dark:hover:bg-green-600 dark:hover:text-white dark:disabled:text-green-600 dark:disabled:hover:bg-transparent':
        color === ComponentColor.SUCCESS && outline,
      'border-red-600 bg-transparent text-red-600 shadow-sm hover:bg-red-100 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-transparent dark:hover:bg-red-600 dark:hover:text-white dark:disabled:text-red-600 dark:disabled:hover:bg-transparent':
        color === ComponentColor.ERROR && outline,
      'border-amber-500 bg-transparent text-amber-500 shadow-sm hover:bg-amber-100 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white disabled:hover:bg-transparent dark:hover:bg-amber-500 dark:hover:text-white dark:disabled:text-amber-500 dark:disabled:hover:bg-transparent':
        color === ComponentColor.WARNING && outline,

      'rounded px-2.5 py-1.5 text-xs': size === ComponentSize.X_SMALL && !round,
      'rounded-md px-3 py-2 text-sm leading-4':
        size === ComponentSize.SMALL && !round,
      'rounded-md px-4 py-2 text-sm': size === ComponentSize.MEDIUM && !round,
      'rounded-md px-4 py-2 text-base': size === ComponentSize.LARGE && !round,
      'rounded-md px-6 py-3 text-base':
        size === ComponentSize.X_LARGE && !round,

      'rounded-full p-1 text-xs': size === ComponentSize.X_SMALL && round,
      'rounded-full p-1.5 text-sm leading-4':
        size === ComponentSize.SMALL && round,
      'rounded-full p-2 text-sm': size === ComponentSize.MEDIUM && round,
      'rounded-full p-2 text-base': size === ComponentSize.LARGE && round,
      'rounded-full p-3 text-base': size === ComponentSize.X_LARGE && round,
    }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>
