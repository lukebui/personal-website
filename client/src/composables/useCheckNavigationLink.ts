import { NavigationBarLink, type NavigationBarLinkGroup } from "@/utils";

export const useCheckNavigationLink = () => {
  const isLink = (
    item: NavigationBarLink | NavigationBarLinkGroup
  ): item is NavigationBarLink => {
    return item instanceof NavigationBarLink;
  };

  return { isLink };
};
