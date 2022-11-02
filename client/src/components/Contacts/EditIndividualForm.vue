<script setup lang="ts">
import AppEditForm from "../Base/AppEditForm.vue";
import AppTextField from "../Base/AppTextField.vue";
import AppTextarea from "../Base/AppTextarea.vue";
import * as yup from "yup";
import {
  IndividualGender,
  useContactsStore,
  type IndividualWithParents,
} from "@/store/contacts";
import _ from "lodash";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys, ComponentColor, ComponentSize } from "@/enums";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import AppButton from "../Base/AppButton.vue";
import AppSwitch from "../Base/AppSwitch.vue";
import AppSelect from "../Base/AppSelect.vue";
import { FieldArray } from "vee-validate";
import AppInputGroup from "../Base/AppInputGroup.vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";

const contactsStore = useContactsStore();

const individuals = computed(() => {
  return contactsStore.individuals;
});

const parentTypes = computed(() => {
  return contactsStore.parentTypes;
});

const props = defineProps({
  item: { type: Object as PropType<IndividualWithParents> },
});

const emit = defineEmits(["cancelled", "saved", "deleted"]);

const { item } = toRefs(props);

const individualSchema = yup.object({
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
});

const parentTypeSchema = yup
  .object({
    id: yup.number(),
    type: yup.string().required().label("Parent Type").defined(),
  })
  .defined();

const parentSchema = yup
  .object({
    id: yup.number().required(),
    type: parentTypeSchema,
    parent: individualSchema,
    child: individualSchema,
  })
  .defined();

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
    currentParents: yup
      .array(parentSchema)
      .label("Parents")
      .default(() => []),
    newParents: yup
      .array(
        yup
          .object({
            type: parentTypeSchema,
            parent: individualSchema,
          })
          .defined()
      )
      .compact((value) => !value.type && !value.parent)
      .default(() => [])
      .label("Parents"),
    removedParents: yup.array(parentSchema).default(() => []),
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
      currentParents: item.value.parents,
      removedParents: [],
      newParents: [],
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

const removeCurrentParent = (
  formData: any,
  setFieldValue: (path: string, value: any) => void,
  remove: (index: number) => void,
  index: number
) => {
  setFieldValue(
    "removedParents",
    (formData.removedParents as unknown[]).concat(
      (formData.currentParents as unknown[])[index]
    )
  );
  remove(index);
};
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
    #="{ formData, setFieldValue }"
  >
    <div class="mb-4 space-y-3">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <AppTextField label="Last Name" name="lastName"></AppTextField>
        <AppTextField label="Middle Name" name="middleName"></AppTextField>
        <AppTextField
          label="First Name"
          name="firstName"
          autofocus
        ></AppTextField>
      </div>
      <AppTextField label="Nickname" name="alias"></AppTextField>
      <AppSelect
        label="Gender"
        required
        name="gender"
        :options="genders"
        option-id="value"
        option-text="name"
      ></AppSelect>
      <AppTextField
        label="Date of birth"
        name="dateOfBirth"
        type="date"
      ></AppTextField>
      <AppTextarea label="Notes" name="note" autoresize></AppTextarea>

      <AppInputGroup label="Parents">
        <div class="divide-y divide-gray-500 sm:divide-y-0">
          <FieldArray name="currentParents" #="{ fields, remove }">
            <div
              v-if="fields.length"
              class="divide-y divide-gray-500 sm:divide-y-0"
            >
              <div
                class="flex items-center gap-2"
                v-for="(field, fieldIndex) in fields"
                :key="field.key"
              >
                <div
                  class="my-1 grid flex-grow grid-cols-1 gap-2 sm:grid-cols-2"
                >
                  <AppSelect
                    :name="`currentParents[${fieldIndex}].type`"
                    :options="parentTypes"
                    return-value
                    option-id="id"
                    option-text="type"
                  ></AppSelect>
                  <AppSelect
                    :name="`currentParents[${fieldIndex}].parent`"
                    :options="individuals"
                    return-value
                    option-id="id"
                    :option-text="(individual: IndividualWithParents) => {return [individual.lastName, individual.middleName, individual.firstName, individual.alias ? `(${individual.alias})`: ''].join(' ')}"
                  ></AppSelect>
                </div>
                <AppButton
                  round
                  :size="ComponentSize.SMALL"
                  @click="
                    removeCurrentParent(
                      formData,
                      setFieldValue,
                      remove,
                      fieldIndex
                    )
                  "
                >
                  <XMarkIcon class="h-5 w-5" />
                </AppButton>
              </div>
            </div>
          </FieldArray>
          <FieldArray name="newParents" #="{ fields, push, remove }">
            <div
              v-if="fields.length"
              class="divide-y divide-gray-500 sm:divide-y-0"
            >
              <div
                class="flex items-center gap-2"
                v-for="(field, fieldIndex) in fields"
                :key="field.key"
              >
                <div
                  class="my-1 grid flex-grow grid-cols-1 gap-2 sm:grid-cols-2"
                >
                  <AppSelect
                    :name="`newParents[${fieldIndex}].type`"
                    :options="parentTypes"
                    return-value
                    option-id="id"
                    option-text="type"
                  ></AppSelect>
                  <AppSelect
                    :name="`newParents[${fieldIndex}].parent`"
                    :options="individuals"
                    return-value
                    option-id="id"
                    :option-text="(individual: IndividualWithParents) => {return [individual.lastName, individual.middleName, individual.firstName, individual.alias ? `(${individual.alias})`: ''].join(' ')}"
                  ></AppSelect>
                </div>
                <AppButton
                  round
                  :size="ComponentSize.SMALL"
                  @click="remove(fieldIndex)"
                >
                  <XMarkIcon class="h-5 w-5" />
                </AppButton>
              </div>
            </div>
            <AppButton
              class="mt-1 w-full"
              block
              :color="ComponentColor.SECONDARY"
              @click="push({})"
            >
              Add parent
            </AppButton>
          </FieldArray>
        </div>
      </AppInputGroup>
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
