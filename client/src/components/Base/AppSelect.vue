<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, toRefs, type PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import type * as yup from "yup";
import _ from "lodash";
import AppInputGroup from "./AppInputGroup.vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import type { SelectableInputOption } from "@/types";
import { useSelectableInput } from "@/composables/useSelectableInput";

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
    validator(value: SelectableInputOption[]) {
      return !!value.length;
    },
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

const getValueText = (
  selectedValues: SelectableInputOption | SelectableInputOption[]
): string => {
  if (_.isArray(selectedValues)) {
    const selectedOptionTexts = _.compact(
      selectedValues.map((tempValue) => {
        const option = options.value.find((option) =>
          _.isEqual(getOptionValue(option), tempValue)
        );
        return option ? getOptionText(option) : undefined;
      })
    );

    return selectedOptionTexts.length
      ? selectedOptionTexts.join(", ")
      : "\u2800";
  } else {
    const selectedOption = options.value.find((option) =>
      _.isEqual(getOptionValue(option), selectedValues)
    );
    return selectedOption ? getOptionText(selectedOption) : "\u2800";
  }
};

const localDisabled = computed(() => {
  return hasOptionIdError.value || disabled.value;
});

value.value = matchInitialValues(value.value);
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
    <Listbox
      as="div"
      :model-value="value"
      @update:model-value="sortValuesOnModelUpdate"
      :multiple="multiple"
      :disabled="localDisabled"
    >
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 dark:bg-gray-800 sm:text-sm"
        >
          <template v-if="value">
            <slot name="selected-option" :option="value">
              <span class="block truncate">
                {{ getValueText(value) }}
              </span>
            </slot>
          </template>
          <span v-else>&nbsp;</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 sm:text-sm"
          >
            <div ref="optionList">
              <ListboxOption
                as="template"
                v-for="(option, optionIndex) in options"
                :key="optionIndex"
                :value="getOptionValue(option)"
                v-slot="{ active, selected }"
                :disabled="localOptionDisabled(option)"
              >
                <li
                  :class="[
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-900 dark:bg-gray-800 dark:text-white',
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                  ]"
                >
                  <slot name="option" :option="option" :selected="selected">
                    <span
                      :class="[
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate',
                      ]"
                    >
                      {{ getOptionText(option) }}
                    </span>
                  </slot>

                  <span
                    v-if="selected"
                    :class="[
                      active
                        ? 'text-white'
                        : 'text-indigo-600 dark:text-indigo-400',
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                    ]"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </div>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </AppInputGroup>
</template>
