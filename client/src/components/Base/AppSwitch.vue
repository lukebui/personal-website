<script setup lang="ts">
import { computed, ref, toRefs, watch, type PropType } from "vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import { v4 as uuidv4 } from "uuid";
import type * as yup from "yup";
import { useField } from "vee-validate";
import AppSpinner from "./AppSpinner.vue";
import { ComponentSize, type ComponentColor } from "@/enums";
import { useErrorMessages } from "@/composables";
import AppInputGroup from "./AppInputGroup.vue";

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

  passive: Boolean,
  rightLabel: Boolean,
  inlineDescription: Boolean,
  asyncSet: Function as PropType<(value: boolean) => Promise<void>>,
  showIcon: Boolean,
  color: { type: String as PropType<ComponentColor> },
  largeLabel: Boolean,
});

const defaultId = uuidv4();

const {
  id,

  modelValue,
  asyncSet,

  rules,
  name,
} = toRefs(props);

const localId = computed(() => {
  return id?.value ? id.value : defaultId;
});

const {
  value: inputValue,
  errorMessage,
  setErrors,
} = useField<boolean>(name, rules, {
  standalone: !name.value,
  initialValue: !name.value ? modelValue : undefined,
});

const enabled = ref(false);

const { getErrorMessages } = useErrorMessages();

watch(enabled, async (newEnabled) => {
  if (newEnabled === inputValue.value) return;
  if (asyncSet?.value) {
    try {
      isLoading.value = true;
      setErrors([]);

      await asyncSet.value(newEnabled);

      inputValue.value = newEnabled;
    } catch (error) {
      setErrors(getErrorMessages(error));
      enabled.value = !enabled.value;
    } finally {
      isLoading.value = false;
    }
  } else {
    inputValue.value = newEnabled;
  }
});

const isLoading = ref(false);

watch(
  inputValue,
  (value) => {
    if (value !== enabled.value) {
      enabled.value = value;
    }
  },
  { immediate: true }
);
</script>

<template>
  <AppInputGroup :error-message="errorMessage">
    <SwitchGroup as="div" class="flex items-center justify-between gap-3">
      <span
        :class="[
          rightLabel ? 'order-2' : 'order-1',
          !inlineDescription ? 'flex flex-col' : '',
          'flex-grow',
        ]"
      >
        <SwitchLabel
          as="span"
          class="text-sm font-medium text-gray-700 dark:text-gray-300"
          :passive="passive"
        >
          <span> {{ label }}&nbsp;</span>
          <span class="text-red-500" v-if="required">&nbsp;*</span>
        </SwitchLabel>
        <SwitchDescription
          as="span"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          {{ description }}
        </SwitchDescription>
      </span>
      <Switch
        v-model="enabled"
        :class="[
          enabled
            ? 'bg-indigo-600 disabled:bg-indigo-400'
            : 'bg-gray-200 dark:bg-gray-600 disabled:dark:bg-gray-400',
          'group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed dark:ring-offset-gray-900',
          rightLabel ? 'order-1' : 'order-2',
        ]"
        :disabled="disabled || isLoading"
        :id="localId"
      >
        <span
          :class="[
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-disabled:bg-gray-50 dark:group-disabled:bg-gray-200',
          ]"
        >
          <template v-if="isLoading">
            <div
              class="absolute inset-0 flex h-full w-full items-center justify-center"
            >
              <AppSpinner :size="ComponentSize.SMALL"></AppSpinner>
            </div>
          </template>
          <template v-else-if="showIcon">
            <span
              :class="[
                enabled
                  ? 'opacity-0 duration-100 ease-out'
                  : 'opacity-100 duration-200 ease-in',
                'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
              ]"
              aria-hidden="true"
            >
              <svg
                class="h-3 w-3 text-gray-400"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span
              :class="[
                enabled
                  ? 'opacity-100 duration-200 ease-in'
                  : 'opacity-0 duration-100 ease-out',
                'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
              ]"
              aria-hidden="true"
            >
              <svg
                class="h-3 w-3 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path
                  d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                />
              </svg>
            </span>
          </template>
        </span>
      </Switch>
    </SwitchGroup>
  </AppInputGroup>
</template>
