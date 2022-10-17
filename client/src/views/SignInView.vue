<script setup lang="ts">
import { useForm, Field } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/store/users";
import { useRoute, useRouter } from "vue-router";
import { RouteNames } from "@/utils";

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
  <div class="min-h-screen flex items-center">
    <form class="w-full max-w-lg mx-auto" @submit="onSubmit">
      <fieldset class="min-w-0 disabled:opacity-50" :disabled="isSubmitting">
        <Field
          as="div"
          class="form-control"
          name="email"
          #="{ field, errorMessage }"
        >
          <label class="label" for="email">
            <span class="label-text"> Email </span>
          </label>
          <input
            class="input input-primary w-full"
            type="email"
            id="email"
            :="field"
            autofocus
          />
          <div class="min-h-[2rem]">
            <label class="label">
              <span class="label-text-alt text-error">
                {{ errorMessage }}
              </span>
            </label>
          </div>
        </Field>
        <Field
          as="div"
          class="form-control"
          name="password"
          #="{ field, errorMessage }"
        >
          <label class="label" for="password">
            <span class="label-text"> Password </span>
          </label>
          <input
            class="input input-primary w-full"
            type="password"
            id="password"
            :="field"
          />
          <div class="min-h-[2rem]">
            <label class="label">
              <span class="label-text-alt text-error">
                {{ errorMessage }}
              </span>
            </label>
          </div>
        </Field>
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
