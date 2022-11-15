import { defineStore } from "pinia";
import type {
  StyledNavigationLink,
  StyledNavigationBarLinkGroup,
} from "@/types";
import { AppLayouts, StoreNames } from "@/enums";

export const useSystemStore = defineStore(StoreNames.SYSTEM, {
  state: () => ({
    navLinks: [] as (StyledNavigationLink | StyledNavigationBarLinkGroup)[],
    layout: AppLayouts.EMPTY,
  }),
  actions: {
    setNavLinks(
      links: (StyledNavigationLink | StyledNavigationBarLinkGroup)[]
    ) {
      this.navLinks = links;
    },
    setLayout(layout: AppLayouts) {
      this.layout = layout;
    },
  },
});
