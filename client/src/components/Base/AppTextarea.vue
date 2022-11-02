<script setup lang="ts">
import AppInputGroup from "./AppInputGroup.vue";
import { v4 as uuidv4 } from "uuid";
import { toRefs, type PropType, computed, ref, watch } from "vue";
import type * as yup from "yup";
import { useField } from "vee-validate";
import { useTextareaAutosize } from "@vueuse/core";

const props = defineProps({
  id: String,
  label: String,
  rules: [String, Object, Function] as PropType<
    | yup.AnySchema
    | string
    | ((value: unknown) => boolean | string | Promise<boolean | string>)
    | ((value: unknown) => boolean | string | Promise<boolean | string>)[]
    | Record<string, unknown>
  >,
  name: { type: String, default: "" },
  description: String,
  required: Boolean,
  placeholder: String,
  validateOnBlur: Boolean,
  modelValue: { type: String, default: "" },
  readonly: Boolean,
  disabled: Boolean,
  autofocus: Boolean,
  autoresize: Boolean,
});
const defaultId = uuidv4();

const { rules, name, id, modelValue, autoresize } = toRefs(props);

const localId = computed(() => {
  return id?.value ? id.value : defaultId;
});

const { errorMessage, value } = useField(name, rules, {
  standalone: !name.value,
  initialValue: !name.value ? modelValue : undefined,
});

const textarea = ref();

const triggerResize = ref<() => void>();

watch(
  autoresize,
  (newAutoresize) => {
    if (newAutoresize) {
      const { triggerResize: resize } = useTextareaAutosize({
        element: textarea,
      });
      triggerResize.value = resize;
    } else {
      triggerResize.value = undefined;
    }
  },
  { immediate: true }
);

watch(
  value,
  () => {
    triggerResize.value?.();
  },
  { immediate: true }
);
</script>

<template>
  <AppInputGroup
    :for-id="localId"
    :label="label"
    :description="description"
    :error-message="errorMessage"
    :required="required"
    :disabled="disabled"
  >
    <div class="flex">
      <div class="relative flex-grow rounded-md shadow-sm">
        <textarea
          ref="textarea"
          v-model="value"
          :id="localId"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :readonly="readonly"
          :class="{
            'block w-full rounded-md disabled:pointer-events-none disabled:opacity-50 sm:text-sm': true,
            'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500':
              errorMessage,
            'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800':
              !errorMessage,
            'resize-none overflow-hidden': autoresize,
          }"
        ></textarea>
      </div>
    </div>
  </AppInputGroup>
</template>
