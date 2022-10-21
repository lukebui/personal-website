import "../src/assets/main.css";
import { themes } from "@storybook/theming";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    darkClass: "dark",
    stylePreview: true,
    dark: { ...themes.dark, appContentBg: "#1f2937" },
  },
};
