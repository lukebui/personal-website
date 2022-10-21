import AppTextField from "../components/AppTextField.vue";
import * as yup from "yup";

export default {
  title: "Components/Forms/TextField",
  component: AppTextField,
};

const Template = (args) => ({
  components: { AppTextField },
  setup() {
    return { args };
  },
  template: `
  <div class="max-w-md">
    <AppTextField v-bind="args.component">  </AppTextField>
  </div>`,
});

export const Default = Template.bind({});
Default.args = {
  component: {
    label: "Email",
    required: true,
    description: "Please enter a valid email address",
    type: "email",
    rules: yup.string().email().required().label("Email"),
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  component: {
    label: "Email",
    required: true,
    description: "Please enter a valid email address",
    type: "email",
    rules: yup.string().email().required().label("Email"),
    modelValue: "a@b.com",
    disabled: true,
  },
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
  component: {
    label: "Password",
    required: true,
    description: "Your password is secured with us",
    type: "password",
    rules: yup.string().required().label("Password"),
  },
};
