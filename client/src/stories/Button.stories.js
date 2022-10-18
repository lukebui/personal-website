import AppButton from "../components/AppButton.vue";
import {
  ButtonStyle,
  ButtonType,
  ComponentColor,
  ComponentSize,
} from "../utils";

export default {
  title: "Components/Elements/Button",
  component: AppButton,
  argTypes: {
    size: {
      control: "select",
      options: ComponentSize,
    },
    color: {
      control: "select",
      options: ComponentColor,
    },
    type: {
      control: "select",
      options: ButtonType,
    },
    buttonStyle: {
      control: "select",
      options: ButtonStyle,
    },
    disabled: {
      control: "boolean",
    },
  },
  parameters: {
    backgrounds: {
      values: [
        { name: "light", value: "#000" },
        { name: "dark", value: "#1f2937" },
      ],
    },
  },
};

const Template = (args) => ({
  components: { AppButton },
  setup() {
    return { args };
  },
  template: `<AppButton v-bind="args"> Click me </AppButton>`,
});

export const Default = Template.bind({});
Default.args = {};

const ColorTemplate = (args) => ({
  components: { AppButton },
  setup() {
    return { args, colors: Object.values(ComponentColor).concat(undefined) };
  },
  template: `
    <div class="flex flex-wrap gap-2">
      <AppButton v-for="(color, colorIndex) in colors" :key="colorIndex" v-bind="args" :color="color">
        Click me!
      </AppButton>
      <AppButton v-for="(color, colorIndex) in colors" :key="colorIndex" v-bind="args" :color="color" buttonStyle="outline">
        Click me!
      </AppButton>
    </div>
  `,
});

export const LightMode = ColorTemplate.bind({});
LightMode.args = {};

export const LightModeDisabled = ColorTemplate.bind({});
LightModeDisabled.args = {
  disabled: true,
};

const DarkColorTemplate = (args) => ({
  components: { AppButton },
  setup() {
    return { args, colors: Object.values(ComponentColor).concat(undefined) };
  },
  template: `
    <div class="flex flex-wrap gap-2 dark">
      <AppButton v-for="(color, colorIndex) in colors" :key="colorIndex" v-bind="args" :color="color">
        Click me!
      </AppButton>
      <AppButton v-for="(color, colorIndex) in colors" :key="colorIndex" v-bind="args" :color="color" buttonStyle="outline">
        Click me!
      </AppButton>
    </div>
  `,
});

export const DarkMode = DarkColorTemplate.bind({});
DarkMode.args = {};
DarkMode.parameters = {
  backgrounds: {
    default: "dark",
  },
};
export const DarkModeDisabled = DarkColorTemplate.bind({});
DarkModeDisabled.args = {
  disabled: true,
};
DarkModeDisabled.parameters = {
  backgrounds: {
    default: "dark",
  },
};
