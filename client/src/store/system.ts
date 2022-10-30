import { defineStore } from "pinia";
import type {
  StyledNavigationLink,
  StyledNavigationBarLinkGroup,
} from "@/types";
import { StoreNames } from "@/enums";

export const useSystemStore = defineStore(StoreNames.SYSTEM, {
  state: () => ({
    navLinks: [] as (StyledNavigationLink | StyledNavigationBarLinkGroup)[],
  }),
  actions: {
    setNavLinks(
      links: (StyledNavigationLink | StyledNavigationBarLinkGroup)[]
    ) {
      this.navLinks = links;
    },
  },
});
