import { defineStore } from "pinia";
import { AppThemes, LocalStorageKeys, StoreNames } from "@/utils";

export const useSystemStore = defineStore(StoreNames.SYSTEM, {
  state: () => ({
    darkMode: false,
  }),
  actions: {
    setDarkMode(dark: boolean) {
      if (dark) {
        document.documentElement.classList.add(AppThemes.DARK);
      } else {
        document.documentElement.classList.remove(AppThemes.DARK);
      }
      this.darkMode = dark;
    },
    loadDarkMode() {
      if (
        localStorage.getItem(LocalStorageKeys.THEME) === AppThemes.DARK ||
        (!(LocalStorageKeys.THEME in localStorage) &&
          window.matchMedia(`(prefers-color-scheme: ${AppThemes.DARK})`)
            .matches)
      ) {
        this.setDarkMode(true);
      } else {
        this.setDarkMode(false);
      }
    },
  },
});
