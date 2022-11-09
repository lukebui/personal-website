<script setup lang="ts">
defineProps({
  forId: String,
  label: String,
  required: Boolean,
  disabled: Boolean,
  description: String,
  errorMessage: String,
});
</script>

<template>
  <fieldset class="min-w-0 space-y-1" :disabled="disabled">
    <label
      v-if="label"
      :for="forId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <span>
        {{ label }}
      </span>
      <span class="text-red-500" v-if="required">&nbsp;*</span>
    </label>
    <div>
      <slot></slot>
    </div>
    <div v-if="description || errorMessage">
      <p
        v-if="!errorMessage"
        class="text-xs text-gray-500 dark:text-gray-300"
        :id="`${forId}-description`"
      >
        {{ description }}
      </p>
      <p class="text-xs text-red-500" :id="`${forId}-error`">
        {{ errorMessage }}
      </p>
    </div>
  </fieldset>
</template>
