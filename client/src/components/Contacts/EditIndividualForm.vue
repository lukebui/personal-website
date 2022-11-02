<script setup lang="ts">
import AppForm from "../Base/AppForm.vue";
import AppTextField from "../Base/AppTextField.vue";
import AppTextarea from "../Base/AppTextarea.vue";
import * as yup from "yup";
import {
  IndividualGender,
  useContactsStore,
  type IndividualWithParents,
} from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys, ComponentColor, ComponentSize } from "@/enums";
import { computed, ref, toRefs, type PropType } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import AppButton from "../Base/AppButton.vue";
import AppSwitch from "../Base/AppSwitch.vue";
import AppSelect from "../Base/AppSelect.vue";
import { FieldArray, useForm } from "vee-validate";
import AppInputGroup from "../Base/AppInputGroup.vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { individualSchema, newParentSchema, parentSchema } from "@/schemas";
import { useErrorMessages } from "@/composables";

const props = defineProps({
  item: { type: Object as PropType<IndividualWithParents> },
});

const emit = defineEmits(["close", "saved"]);

const contactsStore = useContactsStore();

const individuals = computed(() => {
  return contactsStore.individuals;
});

const parentTypes = computed(() => {
  return contactsStore.parentTypes;
});

const { item } = toRefs(props);

type FormData = yup.InferType<typeof individualSchema> & {
  currentParents: yup.InferType<typeof parentSchema>[];
  removedParents: yup.InferType<typeof parentSchema>[];
  newParents: yup.InferType<typeof newParentSchema>[];
};

const formSchema: yup.SchemaOf<FormData> = individualSchema
  .shape({
    currentParents: yup
      .array(parentSchema)
      .label("Parents")
      .default(() => []),
    newParents: yup
      .array(newParentSchema)
      .compact((value) => !value.type && !value.parent)
      .default(() => [])
      .label("Parents"),
    removedParents: yup.array(parentSchema).default(() => []),
  })
  .defined();

const genders: { name: string; value: IndividualGender }[] = [
  { name: "Male", value: IndividualGender.MALE },
  { name: "Female", value: IndividualGender.FEMALE },
];

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const saveItem = async (values: FormData) => {
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

const getFormData = (itemValue?: IndividualWithParents) => {
  if (itemValue) {
    const formData: FormData = {
      id: itemValue.id,
      firstName: itemValue.firstName,
      middleName: itemValue.middleName,
      lastName: itemValue.lastName,
      alias: itemValue.alias,
      note: itemValue.note,
      gender: itemValue.gender,
      dateOfBirth: itemValue.dateOfBirth,
      dateOfDeath: itemValue.dateOfDeath,
      hasDied: itemValue.hasDied,
      currentParents: itemValue.parents,
      removedParents: [],
      newParents: [],
    };
    return formData;
  } else {
    return undefined;
  }
};

const { meta, isSubmitting, useFieldModel, handleSubmit } = useForm<FormData>({
  validationSchema: formSchema,
  initialValues: getFormData(item?.value),
});

const errorMessages = ref<string[]>([]);

const { getErrorMessages } = useErrorMessages();

const onSave = async () => {
  try {
    errorMessages.value = [];
    await handleSubmit(async (values) => {
      await saveItem(values);

      emit("saved");
    })();
  } catch (error) {
    errorMessages.value = getErrorMessages(error);
  }
};

const onDelete = async () => {
  try {
    errorMessages.value = [];
    isSubmitting.value = true;

    await deleteItem();

    emit("close");
  } catch (error) {
    errorMessages.value = getErrorMessages(error);
  } finally {
    isSubmitting.value = false;
  }
};

const onCancel = () => {
  emit("close");
};

const shouldDefaultShowMore = computed(() => {
  return item?.value?.hasDied;
});

const hasDied = useFieldModel("hasDied");

const currentParents = useFieldModel("currentParents");

const removedParents = useFieldModel("removedParents");

const removeCurrentParent = (
  remove: (index: number) => void,
  index: number
) => {
  removedParents.value.push(currentParents.value[index]);
  remove(index);
};
</script>

<template>
  <AppForm
    :errors="errorMessages"
    :loading="isSubmitting"
    :can-save="meta.dirty && meta.valid"
    :can-delete="!!item"
    @save="onSave"
    @delete="onDelete"
    @cancel="onCancel"
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
                  @click="removeCurrentParent(remove, fieldIndex)"
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
              :disabled="!hasDied"
              label="Date of death"
              name="dateOfDeath"
              type="date"
            ></AppTextField>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </AppForm>
</template>
