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

export type NavigationLink = {
  name: string;
  to: RouteLocationRaw;
};

export class StyledNavigationLink implements NavigationLink {
  constructor(
    public name: string,
    public to: RouteLocationRaw,
    public icon?: Component,
    public count?: number
  ) {}
}

export class StyledNavigationBarLinkGroup {
  constructor(
    public name: string,
    public children: NavigationLink[],
    public icon?: Component,
    public count?: number
  ) {}
}

export type InputOption = string | number | boolean | Record<string, any>;

export type MenuAction = {
  text: string;
  action: RouteLocationRaw | (() => void);
};
