import { computed, watch, type Ref } from "vue";
import _ from "lodash";
import type { InputOption } from "@/utils";

export function useOptionIdErrors(
  options: Ref<InputOption[]>,
  getOptionId: (option: InputOption) => string,
  setErrors: (message: string | string[]) => void
) {
  const hasNonPrimitiveOptions = computed(() => {
    return (
      options.value.find(
        (option) =>
          typeof option !== "boolean" ||
          typeof option !== "number" ||
          typeof option !== "string"
      ) !== undefined
    );
  });

  const cannotFindIdInSomeOptions = computed(() => {
    return options.value.find((option) => !getOptionId(option)) !== undefined;
  });

  const notUniqueOptionIds = computed(() => {
    return options.value.length !== _.uniqBy(options.value, getOptionId).length;
  });

  const hasOptionIdError = computed(() => {
    return (
      hasNonPrimitiveOptions.value &&
      (cannotFindIdInSomeOptions.value || notUniqueOptionIds.value)
    );
  });

  watch(
    options,
    () => {
      if (cannotFindIdInSomeOptions.value) {
        setErrors(
          "Cannot find ids for the provided options. Please contact developer."
        );
        return;
      } else if (notUniqueOptionIds.value) {
        setErrors(
          "The provided options have duplicate ids. Please contact developer."
        );
      }
    },
    { immediate: true }
  );

  return { hasOptionIdError };
}
