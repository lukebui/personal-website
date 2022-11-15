<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  steps: {
    type: Array as PropType<string[]>,
  },
  currentStep: Number,
  canNavigate: Boolean,
});

defineEmits<{
  (event: "step", step: number): void;
}>();
</script>

<template>
  <nav aria-label="Progress">
    <ol role="list" class="space-y-4 sm:flex sm:gap-8 sm:space-y-0">
      <li v-for="(step, stepIndex) in steps" :key="stepIndex" class="sm:flex-1">
        <button
          class="group flex w-full flex-col border-l-4 py-2 pl-4 sm:border-l-0 sm:border-t-4 sm:pl-0 sm:pt-4 sm:pb-0"
          :class="
            currentStep && stepIndex < currentStep
              ? [
                  'border-indigo-600  hover:border-indigo-800 disabled:hover:border-indigo-600',
                ]
              : stepIndex === currentStep
              ? ['border-indigo-600']
              : [
                  'border-gray-200 hover:border-gray-300 disabled:hover:border-gray-200 dark:border-gray-700 dark:hover:border-gray-600 dark:disabled:hover:border-gray-700',
                ]
          "
          @click="$emit('step', stepIndex)"
          :disabled="!canNavigate"
        >
          <span
            class="text-sm font-medium"
            :class="
              currentStep && stepIndex < currentStep
                ? [
                    'text-indigo-600 group-hover:text-indigo-800 group-disabled:group-hover:text-indigo-600',
                  ]
                : stepIndex === currentStep
                ? ['text-indigo-600']
                : [
                    'text-gray-500 group-hover:text-gray-900 group-disabled:group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-white dark:group-disabled:group-hover:text-gray-500',
                  ]
            "
            >Step {{ stepIndex + 1 }}</span
          >
          <span class="text-sm font-medium text-gray-900 dark:text-white">{{
            step
          }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>
