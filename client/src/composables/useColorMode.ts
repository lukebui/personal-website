import { useColorMode as vueUseUseColorMode } from "@vueuse/core";

export const useColorMode = () => {
  const colorMode = vueUseUseColorMode();
  const toggleColorMode = () => {
    colorMode.value = colorMode.value === "dark" ? "light" : "dark";
  };

  return {
    colorMode,
    toggleColorMode,
  };
};
