<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/store/users";
import { useRoute, useRouter } from "vue-router";
import { RouteNames } from "@/utils";
import AppTextField from "../components/AppTextField.vue";

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
  <div class="flex min-h-screen items-center">
    <form class="mx-auto w-full max-w-lg" @submit="onSubmit">
      <fieldset class="min-w-0" :disabled="isSubmitting">
        <AppTextField label="Email" name="email" autofocus />
        <AppTextField label="Password" name="password" type="password" />
        <button
          class="btn btn-primary mt-4"
          type="submit"
          :disabled="!meta.dirty || !meta.valid"
        >
          Submit
        </button>
      </fieldset>
    </form>
  </div>
</template>
