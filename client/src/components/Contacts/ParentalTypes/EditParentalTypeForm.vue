<script setup lang="ts">
import {
  AppForm,
  AppTextField,
  AppDeleteConfirmDialog,
} from "@/components/Base";
import type * as yup from "yup";
import type { ParentalType } from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { ref, toRefs, type PropType } from "vue";
import { parentTypeSchema } from "@/schemas";
import { useForm } from "vee-validate";
import { useErrorMessages } from "@/composables";

const props = defineProps({
  item: { type: Object as PropType<ParentalType> },
});

const emit = defineEmits(["cancel", "saved", "deleted"]);

const { item } = toRefs(props);

const formSchema = parentTypeSchema;

type FormData = yup.InferType<typeof formSchema>;

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const saveItem = async (values: unknown) => {
  const response = await fetch(
    `http://localhost:3000/v1/parent-types${
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
    `http://localhost:3000/v1/parent-types/${item.value.id}`,
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

const getFormData = () => {
  if (item?.value) {
    const formData: FormData = {
      id: item.value.id,
      type: item.value.type,
    };
    return formData;
  } else {
    return undefined;
  }
};

const { meta, isSubmitting, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: getFormData(),
});

const deleteConfirmDialog = ref(false);

const errors = ref<string[]>([]);
const { getErrorMessages } = useErrorMessages();

const onCancel = () => {
  emit("cancel");
};

const onSave = async () => {
  try {
    errors.value = [];
    await handleSubmit((values) => saveItem(values))();
    emit("saved");
  } catch (error) {
    errors.value = getErrorMessages(error);
  }
};

const onDelete = () => {
  deleteConfirmDialog.value = true;
};

const onDeleted = () => {
  deleteConfirmDialog.value = false;
  emit("deleted");
};
</script>

<template>
  <AppForm
    :can-save="meta.dirty && meta.valid"
    :can-delete="!!item"
    :loading="isSubmitting"
    @save="onSave"
    @delete="onDelete"
    @cancel="onCancel"
  >
    <div class="mb-4 space-y-3">
      <AppTextField label="Parent type" name="type"></AppTextField>
    </div>
    <AppDeleteConfirmDialog
      :delete-action="deleteItem"
      v-model:show="deleteConfirmDialog"
      @deleted="onDeleted"
    >
      Are you sure you want to delete
      <strong> {{ item?.type }} </strong>? This action cannot be undone.
    </AppDeleteConfirmDialog>
  </AppForm>
</template>
