<script setup lang="ts">
import AppEditForm from "../Base/AppForm.vue";
import AppTextField from "../Base/AppTextField.vue";
import type * as yup from "yup";
import type { ParentType } from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { ref, toRefs, watch, type PropType } from "vue";
import { parentTypeSchema } from "@/schemas";

const props = defineProps({
  item: { type: Object as PropType<ParentType> },
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

const initialValues = ref();

const resetForm = () => {
  if (item?.value) {
    const formData: FormData = {
      id: item.value.id,
      type: item.value.type,
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
  emit("cancel");
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
  >
    <div class="mb-4 space-y-3">
      <AppTextField label="Parent type" name="type" autofocus></AppTextField>
    </div>
  </AppEditForm>
</template>
