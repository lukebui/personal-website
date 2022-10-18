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

export enum ComponentColor {
  PRIMARY = "primary",
  INFO = "info",
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

export enum ComponentSize {
  X_SMALL = "xs",
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  X_LARGE = "xl",
}

export enum ButtonType {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset",
}

export enum ButtonStyle {
  NORMAL = "normal",
  OUTLINE = "outline",
}
