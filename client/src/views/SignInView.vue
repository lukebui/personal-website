<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/store/users";
import { useRoute, useRouter } from "vue-router";
import { ButtonType, ComponentColor, RouteNames } from "@/enums";
import AppTextField from "../components/Base/Forms/AppTextField.vue";
import AppButton from "../components/Base/Elements/AppButton.vue";
import TheEmptyLayout from "../components/Layouts/AppEmptyLayout.vue";

const { validateUser } = useUserStore();

const route = useRoute();
const router = useRouter();

const signInFormSchema = yup
  .object({
    email: yup.string().email().label("Email").required(),
    password: yup.string().label("Password").required(),
  })
  .defined();
const { meta, handleSubmit, isSubmitting } = useForm<
  yup.InferType<typeof signInFormSchema>
>({
  validationSchema: signInFormSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await validateUser(values.email, values.password);

    const redirect = route.query.redirect;
    if (redirect && typeof redirect === "string") {
      router.push({ path: decodeURI(redirect) });
    } else {
      router.push({ name: RouteNames.HOME });
    }
  } catch (error) {
    alert(error);
  }
});
</script>

<template>
  <TheEmptyLayout>
    <div
      class="mx-auto flex min-h-[screen-16] max-w-7xl items-center py-10 px-2 sm:px-6 lg:px-8"
    >
      <form class="mx-auto w-full max-w-sm" @submit="onSubmit">
        <fieldset class="min-w-0" :disabled="isSubmitting">
          <div class="space-y-2">
            <AppTextField
              label="Email"
              name="email"
              autofocus
              validate-on-blur
            />
            <AppTextField label="Password" name="password" type="password" />
          </div>
          <div class="mt-4">
            <AppButton
              :type="ButtonType.SUBMIT"
              :color="ComponentColor.PRIMARY"
              :disabled="!meta.dirty || !meta.valid"
            >
              Submit
            </AppButton>
          </div>
        </fieldset>
      </form>
    </div>
  </TheEmptyLayout>
</template>
