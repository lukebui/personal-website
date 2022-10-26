import { defineStore } from "pinia";
import type { NavigationBarLink, NavigationBarLinkGroup } from "@/types";
import { StoreNames } from "@/enums";

export const useSystemStore = defineStore(StoreNames.SYSTEM, {
  state: () => ({
    navLinks: [] as (NavigationBarLink | NavigationBarLinkGroup)[],
  }),
  actions: {
    setNavLinks(links: (NavigationBarLink | NavigationBarLinkGroup)[]) {
      this.navLinks = links;
    },
  },
});
