import AppButton from "../components/AppButton.vue";
import { ButtonStyle, ComponentColor } from "../utils";

export default {
  title: "Components/Elements/Button",
  component: AppButton,
};

const Template = (args) => ({
  components: { AppButton },
  setup() {
    return { args };
  },
  template: `
  <div :class="['flex flex-wrap gap-2']">
    <AppButton v-for="(color, colorIndex) in args.colors" :key="colorIndex" v-bind="args.component" :color="color">
      Click me!
    </AppButton>
  </div>`,
});

const buttonColors = Object.values(ComponentColor).concat(undefined);

export const Default = Template.bind({});
Default.args = {
  colors: buttonColors,
};

export const Outline = Template.bind({});
Outline.args = {
  colors: buttonColors,
  component: {
    buttonStyle: ButtonStyle.OUTLINE,
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  colors: buttonColors,
  component: {
    disabled: true,
  },
};

export const OutlineDisabled = Template.bind({});
OutlineDisabled.args = {
  colors: buttonColors,
  component: {
    buttonStyle: ButtonStyle.OUTLINE,
    disabled: true,
  },
};
