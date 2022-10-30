import {
  StyledNavigationLink,
  type StyledNavigationBarLinkGroup,
} from "@/types";

export const useCheckNavigationLink = () => {
  const isLink = (
    item: StyledNavigationLink | StyledNavigationBarLinkGroup
  ): item is StyledNavigationLink => {
    return item instanceof StyledNavigationLink;
  };

  return { isLink };
};
