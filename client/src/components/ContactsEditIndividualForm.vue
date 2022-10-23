<script setup lang="ts">
import AppEditForm from "./AppEditForm.vue";
import AppTextField from "./AppTextField.vue";
import * as yup from "yup";
import { IndividualGender, type Individual } from "@/store/contacts";
import * as _ from "lodash";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { ref, toRefs, watch, type PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  item: { type: Object as PropType<Individual>, default: () => null },
});

defineEmits(["cancelled", "saved", "deleted"]);

const { item } = toRefs(props);

const formSchema = yup
  .object({
    id: yup.number(),
    firstName: yup.string().nullable().label("First Name"),
    middleName: yup.string().nullable().label("Middle Name"),
    lastName: yup.string().nullable().label("Last Name"),
    alias: yup.string().nullable().label("Alias"),
    note: yup.string().nullable().label("Notes"),
    gender: yup.string().oneOf(_.values(IndividualGender)).label("Gender"),
  })
  .defined();

type FormData = yup.InferType<typeof formSchema>;

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const saveItem = async (values: unknown) => {
  if (item?.value) {
    const response = await fetch(
      `http://localhost:3000/v1/individuals/${item.value.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
  } else {
    const response = await fetch("http://localhost:3000/v1/individuals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
  }
};

const deleteItem = async () => {
  if (!item.value) return;

  const response = await fetch(
    `http://localhost:3000/v1/individuals/${item.value.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error((await response.json()).message);
};

const formKey = ref(0);

const initialValues = computed(() => {
  if (item.value) {
    const formData: FormData = {
      id: item.value.id,
      firstName: item.value.firstName,
      middleName: item.value.middleName,
      lastName: item.value.lastName,
      alias: item.value.alias,
      note: item.value.note,
      gender: item.value.gender,
    };

    return formData;
  }
  return formSchema.getDefault();
});

watch(initialValues, () => {
  formKey.value++;
});
</script>

<template>
  <AppEditForm
    :form-schema="formSchema"
    :save-item="saveItem"
    :delete-item="item ? deleteItem : undefined"
    :key="formKey"
    :initial-values="initialValues"
    @saved="$emit('saved')"
    @deleted="$emit('deleted')"
    @cancelled="$emit('cancelled')"
  >
    <div class="mb-4 space-y-3">
      <AppTextField
        label="First Name"
        name="firstName"
        autofocus
      ></AppTextField>
      <AppTextField label="Middle Name" name="middleName"></AppTextField>
      <AppTextField label="Last Name" name="lastName"></AppTextField>
      <AppTextField label="Alias" name="alias"></AppTextField>
      <AppTextField label="Notes" name="note"></AppTextField>
      <AppTextField label="Gender" required name="gender"></AppTextField>
    </div>
  </AppEditForm>
</template>
