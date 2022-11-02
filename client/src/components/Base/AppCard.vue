<script setup lang="ts">
import AppProgress from "./AppProgress.vue";
import { ComponentSize } from "@/enums";

defineProps({
  noPadding: Boolean,
  well: Boolean,
  grayHeader: Boolean,
  grayFooter: Boolean,
  mobileFullWidth: Boolean,
  divider: Boolean,
  loading: Boolean,
  disabled: Boolean,
  round: {
    type: Boolean,
    default: true,
  },
  full: Boolean,
  hover: Boolean,
});
</script>

<template>
  <div
    :class="{
      'relative shadow': true,
      'rounded-lg': !mobileFullWidth && round,
      'sm:rounded-lg': mobileFullWidth && round,
      'min-h-full': full,
      'group border border-transparent hover:border-gray-300 dark:hover:border-gray-500':
        hover,
    }"
    data-app-card
  >
    <div
      :class="{
        'absolute top-0 -z-[1] h-full w-full overflow-hidden': true,
        'rounded-lg': !mobileFullWidth && round,
        'sm:rounded-lg': mobileFullWidth && round,
        'bg-white dark:bg-gray-800': !well,
        'bg-gray-50 dark:bg-gray-700': well,
        'group-hover:bg-gray-50 dark:group-hover:bg-gray-700': !well && hover,
        'group-hover:bg-gray-100 dark:group-hover:bg-gray-600': well && hover,
        'divide-y': divider,
      }"
    >
      <AppProgress
        v-if="loading"
        continuous
        :size="ComponentSize.X_SMALL"
      ></AppProgress>
    </div>
    <fieldset class="min-w-0" :disabled="disabled">
      <div
        v-if="$slots.header"
        :class="{
          'rounded-t-lg': round,
          'mobile-fullwidth-table-spacing': !noPadding,
          'bg-gray-100 dark:bg-gray-700': grayHeader && !well,
          'bg-gray-200 dark:bg-gray-600': grayHeader && well,
          'group-hover:bg-gray-200 dark:group-hover:bg-gray-600':
            !well && hover,
          'group-hover:bg-gray-300 dark:group-hover:bg-gray-500': well && hover,
        }"
      >
        <slot name="header" />
      </div>
      <div
        :class="{
          'mobile-fullwidth-table-spacing': !noPadding,
        }"
      >
        <slot />
      </div>
      <div
        v-if="$slots.footer"
        :class="{
          'rounded-b-lg': round,
          'mobile-fullwidth-table-spacing': !noPadding,
          'bg-gray-100 dark:bg-gray-700': grayFooter && !well,
          'bg-gray-200 dark:bg-gray-600': grayFooter && well,
          'group-hover:bg-gray-200 dark:group-hover:bg-gray-600':
            !well && hover,
          'group-hover:bg-gray-300 dark:group-hover:bg-gray-500': well && hover,
        }"
      >
        <slot name="footer" />
      </div>
    </fieldset>
  </div>
</template>
