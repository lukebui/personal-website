import type { SelectableInputOption } from "@/types";
import _ from "lodash";
import type { Ref } from "vue";
import { useOptionIdErrors } from "./useOptionIdErrors";

export const useSelectableInput = (
  value: Ref<SelectableInputOption | SelectableInputOption[]>,
  options: Ref<SelectableInputOption[]>,
  setErrors: (message: string | string[]) => void,
  optionId?: Ref<
    string | ((option: SelectableInputOption) => string) | undefined
  >,
  optionText?: Ref<
    string | ((option: SelectableInputOption) => string) | undefined
  >,
  optionDisabled?: Ref<
    ((option: SelectableInputOption) => boolean) | undefined
  >,
  returnValue?: Ref<boolean | undefined>
) => {
  const getOptionObject = (
    value: SelectableInputOption
  ): SelectableInputOption => {
    return (
      options.value.find((option) =>
        _.isEqual(getOptionId(value), getOptionId(option))
      ) || value
    );
  };

  const matchInitialValues = (
    values: SelectableInputOption | SelectableInputOption[]
  ) => {
    if (_.isArray(values)) {
      return values.map((value) => getOptionObject(value));
    } else {
      return getOptionObject(values);
    }
  };

  const getOptionId = (option: SelectableInputOption): string => {
    if (!optionId?.value) return `${option}`;

    if (typeof optionId?.value === "string") {
      return `${_.get(option, optionId?.value)}`;
    } else {
      return `${optionId?.value?.(option)}`;
    }
  };

  const getOptionText = (option: SelectableInputOption): string => {
    if (!optionText?.value) return `${option}`;

    if (typeof optionText.value === "string") {
      return _.get(option, optionText.value);
    } else {
      return optionText.value(option);
    }
  };

  const getOptionValue = (
    option: SelectableInputOption
  ): SelectableInputOption => {
    if (returnValue?.value) {
      return option;
    } else {
      return getOptionId(option);
    }
  };

  const localOptionDisabled = (option: SelectableInputOption): boolean => {
    if (!optionDisabled?.value) return false;

    return optionDisabled.value(option);
  };

  const sortValuesOnModelUpdate = (
    values: SelectableInputOption | SelectableInputOption[]
  ) => {
    if (_.isArray(values)) {
      // Sort the selected values according to their positions in the original option array
      value.value = values.sort((a, b) => {
        const aIndex = options.value.findIndex((option) =>
          _.isEqual(getOptionValue(option), a)
        );

        const bIndex = options.value.findIndex((option) =>
          _.isEqual(getOptionValue(option), b)
        );

        return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0;
      });
    } else {
      value.value = values;
    }
  };

  const { hasOptionIdError } = useOptionIdErrors(
    options,
    getOptionId,
    setErrors
  );

  return {
    matchInitialValues,
    getOptionText,
    getOptionValue,
    localOptionDisabled,
    sortValuesOnModelUpdate,
    hasOptionIdError,
  };
};
