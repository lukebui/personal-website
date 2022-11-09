<script setup lang="ts">
import {
  AppForm,
  AppTextField,
  AppTextarea,
  AppButton,
  AppSwitch,
  AppSelect,
  AppDeleteConfirmDialog,
} from "@/components/Base";
import type * as yup from "yup";
import { IndividualGender, type Individual } from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { computed, ref, toRefs, type PropType } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useForm } from "vee-validate";
import { individualSchema } from "@/schemas";
import { useErrorMessages } from "@/composables";

const props = defineProps({
  item: { type: Object as PropType<Individual> },
});

const emit = defineEmits(["close", "saved", "deleted"]);

const { item } = toRefs(props);

const formSchema = individualSchema;

type FormData = yup.InferType<typeof formSchema>;

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

const getFormData = (itemValue?: Individual) => {
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

const deleteConfirmDialog = ref(false);

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

const onDelete = () => {
  deleteConfirmDialog.value = true;
};

const onCancel = () => {
  emit("close");
};

const shouldDefaultShowMore = computed(() => {
  return item?.value?.hasDied;
});

const hasDied = useFieldModel("hasDied");

const onDeleted = () => {
  deleteConfirmDialog.value = false;
  emit("deleted");
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
        <AppTextField label="First Name" name="firstName"></AppTextField>
      </div>
      <AppTextField label="Nickname" name="alias"></AppTextField>
      <AppSelect
        label="Gender"
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
    <AppDeleteConfirmDialog
      v-model:show="deleteConfirmDialog"
      :delete-action="deleteItem"
      @deleted="onDeleted"
    >
      Are you sure you want to delete
      <strong> {{ item?.fullName }} </strong>? This action cannot be undone.
    </AppDeleteConfirmDialog>
  </AppForm>
</template>
