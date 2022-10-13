<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

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

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <div class="min-h-screen flex items-center">
    <form class="form-control w-full max-w-lg mx-auto" @submit="onSubmit">
      <fieldset class="min-w-0 disabled:opacity-50" :disabled="isSubmitting">
        <div>
          <label class="label" for="email">Email</label>
          <Field name="email" #="{ field }" validate-on-input>
            <input
              class="input input-primary w-full"
              type="email"
              id="email"
              :="field"
              autofocus
            />
          </Field>
          <ErrorMessage name="email" class="text-error"></ErrorMessage>
        </div>
        <div>
          <label class="label" for="password">Password</label>
          <Field name="password" #="{ field }" validate-on-input>
            <input
              class="input input-primary w-full"
              type="password"
              id="password"
              :="field"
            />
          </Field>
          <ErrorMessage name="password" class="text-error"></ErrorMessage>
        </div>
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
