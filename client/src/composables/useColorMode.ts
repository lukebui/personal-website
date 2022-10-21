import { useColorMode as vueUseUseColorMode } from "@vueuse/core";

export const useColorMode = () => {
  const colorMode = vueUseUseColorMode({ emitAuto: true });
  const toggleColorMode = () => {
    if (colorMode.value === "auto") {
      colorMode.value = "dark";
    } else if (colorMode.value === "dark") {
      colorMode.value = "light";
    } else {
      colorMode.value = "auto";
    }
  };

  return {
    colorMode,
    toggleColorMode,
  };
};
