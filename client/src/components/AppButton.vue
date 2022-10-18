<script setup lang="ts">
import {
  ButtonStyle,
  ButtonType,
  ComponentColor,
  ComponentSize,
} from "@/utils";
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
  style: {
    type: String as PropType<ButtonStyle>,
    default: ButtonStyle.NORMAL,
  },
  disabled: Boolean,
});
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
    :class="{
      'border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:hover:bg-indigo-600':
        color === ComponentColor.PRIMARY && style === ButtonStyle.NORMAL,
      'border-transparent bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 disabled:hover:bg-cyan-600':
        color === ComponentColor.INFO && style === ButtonStyle.NORMAL,
      'border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:hover:bg-green-600':
        color === ComponentColor.SUCCESS && style === ButtonStyle.NORMAL,
      'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:hover:bg-red-600':
        color === ComponentColor.ERROR && style === ButtonStyle.NORMAL,
      'border-transparent bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 disabled:hover:bg-amber-500':
        color === ComponentColor.WARNING && style === ButtonStyle.NORMAL,
      'border-transparent bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 disabled:hover:bg-gray-500':
        color === undefined && style === ButtonStyle.NORMAL,
      'border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-500 disabled:hover:bg-transparent dark:border-indigo-500 dark:text-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white dark:disabled:text-indigo-500 dark:disabled:hover:bg-transparent':
        color === ComponentColor.PRIMARY && style === ButtonStyle.OUTLINE,
      'border-cyan-600 bg-transparent text-cyan-600 hover:bg-cyan-100 focus:ring-cyan-500 disabled:hover:bg-transparent dark:hover:bg-cyan-600 dark:hover:text-white dark:disabled:text-cyan-600 dark:disabled:hover:bg-transparent':
        color === ComponentColor.INFO && style === ButtonStyle.OUTLINE,
      'border-green-600 bg-transparent text-green-600 hover:bg-green-100 focus:ring-green-500 disabled:hover:bg-transparent dark:hover:bg-green-600 dark:hover:text-white dark:disabled:text-green-600 dark:disabled:hover:bg-transparent':
        color === ComponentColor.SUCCESS && style === ButtonStyle.OUTLINE,
      'border-red-600 bg-transparent text-red-600 hover:bg-red-100 focus:ring-red-500 disabled:hover:bg-transparent dark:hover:bg-red-600 dark:hover:text-white dark:disabled:text-red-600 dark:disabled:hover:bg-transparent':
        color === ComponentColor.ERROR && style === ButtonStyle.OUTLINE,
      'border-amber-500 bg-transparent text-amber-500 hover:bg-amber-600 focus:ring-amber-500 disabled:hover:bg-transparent dark:hover:bg-amber-500 dark:hover:text-white dark:disabled:text-amber-500 dark:disabled:hover:bg-transparent':
        color === ComponentColor.WARNING && style === ButtonStyle.OUTLINE,
      'border-gray-500 bg-transparent text-gray-300 hover:bg-gray-50 focus:ring-gray-500 disabled:hover:bg-white dark:border-gray-500 dark:hover:bg-gray-500 dark:hover:text-white dark:disabled:text-gray-500 dark:disabled:hover:bg-transparent':
        color === undefined && style === ButtonStyle.OUTLINE,
      'rounded px-2.5 py-1.5 text-xs': size === ComponentSize.X_SMALL,
      'rounded-md px-3 py-2 text-sm leading-4': size === ComponentSize.SMALL,
      'rounded-md px-4 py-2 text-sm': size === ComponentSize.MEDIUM,
      'rounded-md px-4 py-2 text-base': size === ComponentSize.LARGE,
      'rounded-md px-6 py-3 text-base': size === ComponentSize.X_LARGE,
    }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>
