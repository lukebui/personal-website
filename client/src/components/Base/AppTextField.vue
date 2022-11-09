<script setup lang="ts">
import type { TextFieldInputType } from "@/types";
import AppInputGroup from "./AppInputGroup.vue";
import { v4 as uuidv4 } from "uuid";
import { ref, toRefs, type PropType, computed } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";
import type * as yup from "yup";
import { useField } from "vee-validate";

const props = defineProps({
  // Default input props
  id: String,
  label: String,
  description: String,
  name: { type: String, default: "" },
  rules: [String, Object, Function] as PropType<
    | yup.AnySchema
    | string
    | ((value: unknown) => boolean | string | Promise<boolean | string>)
    | ((value: unknown) => boolean | string | Promise<boolean | string>)[]
    | Record<string, unknown>
  >,
  modelValue: null,
  required: Boolean,
  disabled: Boolean,

  type: {
    type: String as PropType<TextFieldInputType>,
    default: "text",
  },
  placeholder: String,
  validateOnBlur: Boolean,
  readonly: Boolean,
  autofocus: Boolean,
});

const {
  id,
  label,
  type,
  rules,
  name,
  description,
  required,
  placeholder,
  modelValue,
  readonly,
  disabled,
  autofocus,
  validateOnBlur,
} = toRefs(props);

const defaultId = uuidv4();

const localId = computed(() => {
  return id?.value ? id.value : defaultId;
});

const { errorMessage, value, handleBlur, validate } = useField(name, rules, {
  standalone: !name.value,
  initialValue: !name.value ? modelValue : undefined,
  validateOnValueUpdate: !validateOnBlur.value,
});

const onBlur = async () => {
  if (validateOnBlur.value) {
    await validate();
  }
  handleBlur();
};

const onInputClick = (event: MouseEvent) => {
  (event.target as HTMLInputElement).select();
};

const showPassword = ref(false);

const localInputType = computed((): TextFieldInputType => {
  if (type.value === "password") {
    return showPassword.value ? "text" : "password";
  } else {
    return type.value;
  }
});
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
    <div class="relative rounded-md shadow-sm">
      <input
        v-model="value"
        :id="localId"
        class="block w-full rounded-md bg-white shadow-sm disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-700 dark:disabled:text-gray-400 sm:text-sm"
        :class="{
          'pr-9': type === 'password',
          'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500':
            errorMessage,
          'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500':
            !errorMessage,
        }"
        :type="localInputType"
        :autofocus="autofocus"
        :readonly="readonly"
        :placeholder="placeholder"
        @click="onInputClick"
        @blur="onBlur"
      />
      <div class="absolute inset-y-0 right-px flex items-center">
        <button
          type="button"
          v-if="type === 'password'"
          class="inline-flex items-center rounded-md p-2 text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed dark:text-white dark:hover:bg-gray-700 dark:disabled:text-gray-500"
          @click="showPassword = !showPassword"
        >
          <EyeIcon v-if="showPassword" class="h-5 w-5" />
          <EyeSlashIcon v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
  </AppInputGroup>
</template>

<style scoped lang="postcss">
input[type="date"]::-webkit-calendar-picker-indicator {
  @apply dark:invert;
}
</style>
