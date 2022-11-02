<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import type * as yup from "yup";
import _ from "lodash";
import { useOptionIdErrors } from "../../composables";
import AppInputGroup from "./AppInputGroup.vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import type { InputOption } from "@/types";
import { useElementBounding, useWindowSize } from "@vueuse/core";

const props = defineProps({
  id: String,
  label: String,
  description: String,
  name: { type: String, default: "" },
  options: {
    type: Array as PropType<InputOption[]>,
    required: true,
    validator(value: InputOption[]) {
      return !!value.length;
    },
  },
  optionId: {
    type: [String, Function] as PropType<
      string | ((option: InputOption) => string)
    >,
  },
  optionText: {
    type: [String, Function] as PropType<
      string | ((option: InputOption) => string)
    >,
  },
  returnValue: Boolean,
  rules: [String, Object, Function] as PropType<
    | yup.AnySchema
    | string
    | ((value: unknown) => boolean | string | Promise<boolean | string>)
    | ((value: unknown) => boolean | string | Promise<boolean | string>)[]
    | Record<string, unknown>
  >,
  modelValue: null,
  disabled: Boolean,
  optionDisabled: Function as PropType<
    (option: unknown, index: number) => boolean
  >,
  multiple: Boolean,
  required: Boolean,
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

const getOptionObject = (value: InputOption): InputOption => {
  return (
    options.value.find((option) =>
      _.isEqual(getOptionId(value), getOptionId(option))
    ) || value
  );
};

const matchInitialValues = (values: InputOption | InputOption[]) => {
  if (_.isArray(values)) {
    return values.map((value) => getOptionObject(value));
  } else {
    return getOptionObject(values);
  }
};

const getOptionId = (option: InputOption): string => {
  if (!optionId?.value) return `${option}`;

  if (typeof optionId?.value === "string") {
    return `${_.get(option, optionId?.value)}`;
  } else {
    return `${optionId?.value?.(option)}`;
  }
};

const getValueText = (selectedValues: InputOption | InputOption[]): string => {
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

const getOptionText = (option: InputOption): string => {
  if (!optionText?.value) return `${option}`;

  if (typeof optionText.value === "string") {
    return _.get(option, optionText.value);
  } else {
    return optionText.value(option);
  }
};

const getOptionValue = (option: InputOption): InputOption => {
  if (returnValue.value) {
    return option;
  } else {
    return getOptionId(option);
  }
};

const localOptionDisabled = (option: unknown, index: number): boolean => {
  if (!optionDisabled?.value) return false;

  return optionDisabled.value(option, index);
};

const localDisabled = computed(() => {
  return hasOptionIdError.value || disabled.value;
});

const onUpdateModelValue = (event: InputOption | InputOption[]) => {
  if (_.isArray(event)) {
    // Sort the selected values according to their positions in the original option array
    value.value = event.sort((a, b) => {
      const aIndex = options.value.findIndex((option) =>
        _.isEqual(getOptionValue(option), a)
      );

      const bIndex = options.value.findIndex((option) =>
        _.isEqual(getOptionValue(option), b)
      );

      return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0;
    });
  } else {
    value.value = event;
  }
};

const optionList = ref<HTMLDivElement>();

const closestOptionListContainer = computed(() => {
  if (optionList.value) {
    const card = optionList.value.closest("[data-app-card]");
    if (card) return card as HTMLElement;

    const listOptionsContainer = optionList.value.closest(
      "[data-option-list-container]"
    );
    if (listOptionsContainer) return listOptionsContainer as HTMLElement;
  }

  return undefined;
});

const bottomOptions = ref(true);

watch([optionList, closestOptionListContainer], (values) => {
  const listBounding = useElementBounding(values[0]);
  const containerBounding = useElementBounding(values[1]);
  const windowSize = useWindowSize();
  bottomOptions.value = !(
    listBounding.bottom.value > containerBounding.bottom.value ||
    listBounding.bottom.value > windowSize.height.value
  );
});

const { errorMessage, value, setErrors } = useField<
  InputOption | InputOption[]
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

value.value = matchInitialValues(value.value);

const { hasOptionIdError } = useOptionIdErrors(options, getOptionId, setErrors);
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
      @update:model-value="onUpdateModelValue"
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
            class="absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 sm:text-sm"
            :class="{
              'mt-1': bottomOptions,
              'bottom-full mb-1': !bottomOptions,
            }"
          >
            <div ref="optionList">
              <ListboxOption
                as="template"
                v-for="(option, optionIndex) in options"
                :key="optionIndex"
                :value="getOptionValue(option)"
                v-slot="{ active, selected }"
                :disabled="localOptionDisabled(option, optionIndex)"
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
