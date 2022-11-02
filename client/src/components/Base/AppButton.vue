<script setup lang="ts">
import { ButtonType, ComponentColor, ComponentSize } from "../../enums";
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
  text: Boolean,
});
</script>

<template>
  <button
    :type="type"
    :class="{
      block: block,
      'inline-flex': !block,

      'button-color-default': color === undefined,
      'button-color-primary': color === ComponentColor.PRIMARY,
      'button-color-secondary': color === ComponentColor.SECONDARY,
      'button-color-success': color === ComponentColor.SUCCESS,
      'button-color-error': color === ComponentColor.ERROR,
      'button-color-warning': color === ComponentColor.WARNING,
      'button-color-info': color === ComponentColor.INFO,
      'button-size-xs': size === ComponentSize.X_SMALL,
      'button-size-sm': size === ComponentSize.SMALL,
      'button-size-md': size === ComponentSize.MEDIUM,
      'button-size-lg': size === ComponentSize.LARGE,
      'button-size-xl': size === ComponentSize.X_LARGE,
      'button-outline': outline,
      'button-outline-0': !outline,
      'button-rounded': round,
      'button-rounded-0': !round,
      'button-text': text,
      'button-text-0': !text,
    }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
button {
  @apply items-center justify-center font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800;

  &.button-text {
    @apply -mx-1 border-0 px-1;
  }

  &.button-text-0 {
    @apply border;
  }

  &.button-color-default {
    &.button-text {
      @apply text-gray-900 hover:text-gray-500 focus:ring-indigo-500 disabled:hover:text-gray-900 dark:text-white dark:hover:text-gray-300 dark:disabled:hover:text-white;
    }
    &.button-text-0 {
      @apply text-gray-900 focus:ring-indigo-500 focus:ring-offset-0 dark:text-white  dark:focus:ring-indigo-500 dark:focus:ring-offset-0;
      &.button-outline {
        @apply border-gray-300 bg-white shadow-sm hover:bg-gray-300 disabled:bg-white dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-600 dark:disabled:hover:bg-gray-800;
      }
      &.button-outline-0 {
        @apply border-transparent shadow-none backdrop-blur-lg hover:backdrop-brightness-90 disabled:hover:backdrop-brightness-100 dark:hover:backdrop-brightness-150 dark:disabled:hover:backdrop-brightness-100;
      }
    }
  }

  &.button-color-primary {
    &.button-text {
      @apply text-indigo-600 hover:text-indigo-800 focus:ring-indigo-500 disabled:hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-white dark:disabled:text-indigo-500;
    }
    &.button-text-0 {
      &.button-outline {
        @apply border-indigo-600 bg-transparent text-indigo-600 shadow-sm hover:bg-indigo-100 focus:ring-indigo-500 focus:ring-offset-2 disabled:hover:bg-transparent dark:border-indigo-500 dark:text-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white dark:disabled:text-indigo-500 dark:disabled:hover:bg-transparent;
      }
      &.button-outline-0 {
        @apply border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 disabled:hover:bg-indigo-600;
      }
    }
  }

  &.button-color-secondary {
    &.button-text {
      @apply text-gray-500 hover:text-gray-800 focus:ring-gray-500 disabled:hover:text-gray-500 dark:text-gray-500 dark:hover:text-white dark:disabled:text-gray-500;
    }
    &.button-text-0 {
      &.button-outline {
        @apply border-gray-500 bg-transparent text-gray-500 shadow-sm hover:bg-gray-100 focus:ring-gray-500 focus:ring-offset-2 disabled:hover:bg-white dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-white dark:disabled:text-gray-300 dark:disabled:hover:bg-transparent;
      }
      &.button-outline-0 {
        @apply border-transparent bg-gray-200 shadow-sm hover:bg-gray-300 focus:ring-gray-500 focus:ring-offset-2 disabled:hover:bg-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:disabled:hover:bg-gray-600;
      }
    }
  }
  &.button-color-info {
    &.button-text {
      @apply text-cyan-500 hover:text-cyan-800 focus:ring-cyan-500 disabled:hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-white dark:disabled:text-cyan-500;
    }
    &.button-text-0 {
      &.button-outline {
        @apply border-cyan-600 bg-transparent text-cyan-600 shadow-sm hover:bg-cyan-100 focus:ring-cyan-500 focus:ring-offset-2 disabled:hover:bg-transparent dark:hover:bg-cyan-600 dark:hover:text-white dark:disabled:text-cyan-600 dark:disabled:hover:bg-transparent;
      }
      &.button-outline-0 {
        @apply border-transparent bg-cyan-600 text-white shadow-sm hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-offset-2 disabled:hover:bg-cyan-600;
      }
    }
  }
  &.button-color-success {
    &.button-text {
      @apply text-green-500 hover:text-green-800 focus:ring-green-500 disabled:hover:text-green-500 dark:text-green-500 dark:hover:text-white dark:disabled:text-green-500;
    }
    &.button-text-0 {
      &.button-outline {
        @apply border-green-600 bg-transparent text-green-600 shadow-sm hover:bg-green-100 focus:ring-green-500 focus:ring-offset-2 disabled:hover:bg-transparent dark:hover:bg-green-600 dark:hover:text-white dark:disabled:text-green-600 dark:disabled:hover:bg-transparent;
      }
      &.button-outline-0 {
        @apply border-transparent bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2 disabled:hover:bg-green-600;
      }
    }
  }
  &.button-color-error {
    &.button-text {
      @apply text-red-500 hover:text-red-800 focus:ring-red-500 disabled:hover:text-red-500 dark:text-red-500 dark:hover:text-white dark:disabled:text-red-500;
    }
    &.button-text-0 {
      &.button-outline {
        @apply border-red-600 bg-transparent text-red-600 shadow-sm hover:bg-red-100 focus:ring-red-500 focus:ring-offset-2 disabled:hover:bg-transparent dark:hover:bg-red-600 dark:hover:text-white dark:disabled:text-red-600 dark:disabled:hover:bg-transparent;
      }
      &.button-outline-0 {
        @apply border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2 disabled:hover:bg-red-600;
      }
    }
  }
  &.button-color-warning {
    &.button-text {
      @apply text-amber-500 hover:text-amber-800 focus:ring-amber-500 disabled:hover:text-amber-500 dark:text-amber-500 dark:hover:text-white dark:disabled:text-amber-500;
    }
    &.button-text-0 {
      &.button-outline {
        @apply border-amber-500 bg-transparent text-amber-500 shadow-sm hover:bg-amber-100 focus:ring-amber-500 focus:ring-offset-2 disabled:hover:bg-transparent dark:hover:bg-amber-500 dark:hover:text-white dark:disabled:text-amber-500 dark:disabled:hover:bg-transparent;
      }
      &.button-outline-0 {
        @apply border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-600 focus:ring-amber-500 focus:ring-offset-2 disabled:hover:bg-amber-500;
      }
    }
  }

  &.button-size-xs {
    @apply text-sm;

    &.button-text {
      @apply rounded;
    }
    &.button-text-0 {
      &.button-rounded {
        @apply rounded-full p-1;
      }
      &.button-rounded-0 {
        @apply rounded px-2.5 py-1.5;
      }
    }
  }
  &.button-size-sm {
    @apply text-sm leading-4;

    &.button-text {
      @apply rounded;
    }

    &.button-text-0 {
      &.button-rounded {
        @apply rounded-full p-1.5;
      }
      &.button-rounded-0 {
        @apply rounded-md px-3 py-2;
      }
    }
  }
  &.button-size-md {
    @apply text-sm;

    &.button-text {
      @apply rounded;
    }

    &.button-text-0 {
      &.button-rounded {
        @apply rounded-full p-2;
      }
      &.button-rounded-0 {
        @apply rounded-md px-4 py-2;
      }
    }
  }
  &.button-size-lg {
    @apply text-base;

    &.button-text {
      @apply rounded;
    }

    &.button-text-0 {
      &.button-rounded {
        @apply rounded-full p-2;
      }
      &.button-rounded-0 {
        @apply rounded-md px-4 py-2;
      }
    }
  }
  &.button-size-xl {
    @apply text-base;

    &.button-text {
      @apply rounded;
    }

    &.button-text-0 {
      &.button-rounded {
        @apply rounded-full p-3;
      }
      &.button-rounded-0 {
        @apply rounded-md px-6 py-3;
      }
    }
  }
}
</style>
