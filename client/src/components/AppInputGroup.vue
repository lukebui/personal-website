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
    <label :for="id" class="block text-sm font-medium text-gray-700">
      <span>
        {{ label }}
      </span>
      <span class="text-red-500" v-if="required">*</span>
    </label>
    <div class="mt-1">
      <slot></slot>
    </div>
    <p class="mt-2 text-sm text-gray-500" :id="`${id}-description`">
      {{ description }}
    </p>
    <p class="mt-2 text-sm text-red-500" :id="`${id}-error`">
      {{ errorMessage }} &nbsp;
    </p>
  </fieldset>
</template>
