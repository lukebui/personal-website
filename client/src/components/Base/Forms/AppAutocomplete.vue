<script setup lang="ts">
import { computed, ref, type PropType, toRefs } from "vue";
import { v4 as uuidv4 } from "uuid";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import type * as yup from "yup";
import type { SelectableInputOption } from "@/types";
import { useSelectableInput } from "@/composables";
import { useField } from "vee-validate";
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

  // Selectable input props
  options: {
    type: Array as PropType<SelectableInputOption[]>,
    required: true,
  },
  optionId: {
    type: [String, Function] as PropType<
      string | ((option: SelectableInputOption) => string)
    >,
  },
  optionText: {
    type: [String, Function] as PropType<
      string | ((option: SelectableInputOption) => string)
    >,
  },
  optionDisabled: Function as PropType<
    (option: SelectableInputOption) => boolean
  >,
  returnValue: Boolean,
  multiple: Boolean,

  absolute: Boolean,
  nullable: Boolean,
});

const defaultId = uuidv4();

const {
  id,
  label,
  description,
  name,
  options,
  optionId,
  optionText,
  returnValue,
  rules,
  modelValue,
  disabled,
  optionDisabled,
  multiple,
} = toRefs(props);

const localId = computed(() => {
  return id?.value ? id.value : defaultId;
});

const { errorMessage, value, setErrors } = useField<
  SelectableInputOption | SelectableInputOption[]
>(name, rules, {
  standalone: !name.value,
  initialValue: !name.value
    ? modelValue?.value
      ? modelValue
      : multiple.value
      ? []
      : undefined
    : undefined,
});

const {
  matchInitialValues,
  getOptionText,
  getOptionValue,
  localOptionDisabled,
  sortValuesOnModelUpdate,
  hasOptionIdError,
} = useSelectableInput(
  value,
  options,
  setErrors,
  optionId,
  optionText,
  optionDisabled,
  returnValue
);

const localDisabled = computed(() => {
  return hasOptionIdError.value || disabled.value;
});

value.value = matchInitialValues(value.value);

const query = ref("");
const filteredOptions = computed(() =>
  query.value === ""
    ? options.value
    : options.value.filter((option) => {
        return getOptionText(option)
          .toLowerCase()
          .includes(query.value.toLowerCase());
      })
);
</script>
<template>
  <AppInputGroup
    :for-id="localId"
    :label="label"
    :description="description"
    :error-message="errorMessage"
    :required="required"
    :disabled="localDisabled"
  >
    <Combobox
      as="div"
      v-model="value"
      @update:model-value="sortValuesOnModelUpdate"
      :nullable="nullable"
    >
      <div class="relative mt-1">
        <ComboboxInput
          class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm"
          @change="query = $event.target.value"
          :display-value="(item) => (item ? getOptionText(item) : '')"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        v-if="filteredOptions.length > 0"
        class="z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 sm:text-sm"
        :class="{ absolute }"
      >
        <ComboboxOption
          v-for="(option, optionIndex) in filteredOptions"
          :key="optionIndex"
          :value="getOptionValue(option)"
          as="template"
          v-slot="{ active, selected }"
          :disabled="localOptionDisabled(option)"
        >
          <li
            :class="[
              'relative cursor-default select-none py-2 pl-3 pr-9 dark:text-white',
              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
            ]"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ getOptionText(option) }}
            </span>

            <span
              v-if="selected"
              :class="[
                'absolute inset-y-0 right-0 flex items-center pr-4',
                active ? 'text-white' : 'text-indigo-600',
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>
  </AppInputGroup>
</template>
