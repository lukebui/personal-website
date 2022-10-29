<script setup lang="ts">
import AppEditForm from "./AppEditForm.vue";
import AppTextField from "./AppTextField.vue";
import AppTextarea from "./AppTextarea.vue";
import * as yup from "yup";
import { IndividualGender, type Individual } from "@/store/contacts";
import _ from "lodash";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import AppButton from "./AppButton.vue";
import AppSwitch from "./AppSwitch.vue";
import AppSelect from "./AppSelect.vue";

const props = defineProps({
  item: { type: Object as PropType<Individual> },
});

const emit = defineEmits(["cancelled", "saved", "deleted"]);

const { item } = toRefs(props);

const formSchema = yup
  .object({
    id: yup.number().nullable(),
    firstName: yup
      .string()
      .nullable()
      .label("First Name")
      .transform((value: string | null) => value && value.trim()),
    middleName: yup
      .string()
      .nullable()
      .label("Middle Name")
      .transform((value: string | null) => value && value.trim()),
    lastName: yup
      .string()
      .nullable()
      .label("Last Name")
      .transform((value: string | null) => value && value.trim()),
    alias: yup.string().nullable().label("Alias"),
    note: yup.string().nullable().label("Notes"),
    gender: yup
      .string()
      .required()
      .oneOf(_.values(IndividualGender))
      .label("Gender"),
    dateOfBirth: yup
      .date()
      .nullable()
      .label("Date of birth")
      .transform((value, _originalValue, schema) => {
        if (schema.isType(value)) return value;

        return null;
      }),
    dateOfDeath: yup
      .date()
      .nullable()
      .label("Date of death")
      .transform((value, _originalValue, schema) => {
        if (schema.isType(value)) return value;

        return null;
      }),
    hasDied: yup.boolean().label("Has died").nullable(),
  })
  .defined();

type FormData = yup.InferType<typeof formSchema>;

const genders: { name: string; value: IndividualGender }[] = [
  { name: "Male", value: IndividualGender.MALE },
  { name: "Female", value: IndividualGender.FEMALE },
];

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const saveItem = async (values: unknown) => {
  const response = await fetch(
    `http://localhost:3000/v1/individuals${
      item?.value ? "/" + item.value.id : ""
    }`,
    {
      method: item?.value ? "PATCH" : "POST",
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
};

const deleteItem = async () => {
  if (!item?.value) return;

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

const initialValues = ref();

const resetForm = () => {
  if (item?.value) {
    const formData: FormData = {
      id: item.value.id,
      firstName: item.value.firstName,
      middleName: item.value.middleName,
      lastName: item.value.lastName,
      alias: item.value.alias,
      note: item.value.note,
      gender: item.value.gender,
      dateOfBirth: item.value.dateOfBirth,
      dateOfDeath: item.value.dateOfDeath,
      hasDied: item.value.hasDied,
    };
    initialValues.value = formData;
  } else {
    initialValues.value = {};
  }
};

watch(
  () => item?.value,
  () => {
    resetForm();
  },
  { immediate: true }
);

const onCancel = () => {
  emit("cancelled");
};

const shouldDefaultShowMore = computed(() => {
  return item?.value?.hasDied;
});
</script>

<template>
  <AppEditForm
    v-if="initialValues"
    :form-schema="formSchema"
    :save-item="saveItem"
    :delete-item="item ? deleteItem : undefined"
    :initial-values="initialValues"
    @saved="$emit('saved')"
    @deleted="$emit('deleted')"
    @cancelled="onCancel"
    #="{ formData }"
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
      <AppSelect
        label="Gender"
        required
        name="gender"
        :options="genders"
        option-id="value"
        option-value="value"
        option-text="name"
      ></AppSelect>
      <AppTextField
        label="Date of birth"
        name="dateOfBirth"
        type="date"
      ></AppTextField>
      <AppTextarea label="Notes" name="note" autoresize></AppTextarea>
      <Disclosure :default-open="shouldDefaultShowMore" #="{ open }">
        <div class="pt-2">
          <DisclosureButton as="template">
            <AppButton outline>
              {{ open ? "Less" : "More" }}
            </AppButton>
          </DisclosureButton>
        </div>
        <DisclosurePanel>
          <div class="space-y-3">
            <AppSwitch name="hasDied" label="Has died" right-label> </AppSwitch>
            <AppTextField
              :disabled="!formData.hasDied"
              label="Date of death"
              name="dateOfDeath"
              type="date"
            ></AppTextField>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </AppEditForm>
</template>
