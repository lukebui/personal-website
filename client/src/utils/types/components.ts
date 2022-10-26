import type { Component } from "vue";
import type { RouteLocationRaw } from "vue-router";

export type TextFieldInputType =
  | "number"
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "password"
  | "range"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export class NavigationBarLink {
  constructor(
    public name: string,
    public to: RouteLocationRaw,
    public icon?: Component,
    public count?: number
  ) {}
}

export type OptionType = string | number | boolean | Record<string, any>;

export class NavigationBarLinkGroup {
  constructor(
    public name: string,
    public children: ChildrenNavigationLink[],
    public icon?: Component,
    public count?: number
  ) {}
}

export type ChildrenNavigationLink = {
  name: string;
  to: RouteLocationRaw;
};
