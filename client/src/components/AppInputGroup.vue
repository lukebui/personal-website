<script setup lang="ts">
defineProps({
  id: String,
  label: String,
  required: Boolean,
  disabled: Boolean,
  description: String,
  errorMessage: String,
});
</script>

<template>
  <fieldset class="min-w-0" :disabled="disabled">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <span>
        {{ label }}
      </span>
      <span class="text-red-500" v-if="required">&nbsp;*</span>
    </label>
    <div class="mt-1">
      <slot></slot>
    </div>
    <div v-if="description || errorMessage" class="mt-1">
      <p
        v-if="!errorMessage"
        class="text-xs text-gray-500 dark:text-gray-300"
        :id="`${id}-description`"
      >
        {{ description }}
      </p>
      <p class="text-xs text-red-500" :id="`${id}-error`">
        {{ errorMessage }}
      </p>
    </div>
  </fieldset>
</template>
