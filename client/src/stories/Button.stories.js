import AppButton from "../components/AppButton.vue";
import { ComponentColor } from "../enums";
import { PlusIcon } from "@heroicons/vue/24/solid";

export default {
  title: "Components/Elements/Button",
  component: AppButton,
};

const Template = (args) => ({
  components: { AppButton, PlusIcon },
  setup() {
    return { args };
  },
  template: `
  <div :class="['flex flex-wrap gap-2']">
    <AppButton v-for="(color, colorIndex) in args.colors" :key="colorIndex" v-bind="args.component" :color="color">
      <PlusIcon v-if="args.component && args.component.round" class="h-6 w-6" />
      <span v-else>
        Click me!
      </span>
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
    outline: true,
  },
};

export const Round = Template.bind({});
Round.args = {
  colors: buttonColors,
  component: {
    round: true,
  },
};

export const Text = Template.bind({});
Text.args = {
  colors: buttonColors,
  component: {
    text: true,
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
    outline: true,
    disabled: true,
  },
};

export const RoundDisabled = Template.bind({});
RoundDisabled.args = {
  colors: buttonColors,
  component: {
    round: true,
    disabled: true,
  },
};

export const TextDisabled = Template.bind({});
TextDisabled.args = {
  colors: buttonColors,
  component: {
    text: true,
    disabled: true,
  },
};
