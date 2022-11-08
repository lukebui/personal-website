<script setup lang="ts">
import AppForm from "../../Base/AppForm.vue";
import type * as yup from "yup";
import { useContactsStore, type Couple } from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import AppSelect from "../../Base/AppSelect.vue";
import { useForm } from "vee-validate";
import { coupleSchema } from "@/schemas";
import { useErrorMessages } from "@/composables";
import AppDeleteConfirmDialog from "../../Base/AppDeleteConfirmDialog.vue";
import AppSwitch from "@/components/Base/AppSwitch.vue";

const props = defineProps({
  item: { type: Object as PropType<Couple> },
});

const emit = defineEmits(["close", "saved", "deleted"]);

const { item } = toRefs(props);

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals);

const formSchema = coupleSchema;

type FormData = yup.InferType<typeof formSchema>;

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const saveItem = async (values: FormData) => {
  const response = await fetch(
    `http://localhost:3000/v1/couples${item?.value ? "/" + item.value.id : ""}`,
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
    `http://localhost:3000/v1/couples/${item.value.id}`,
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

const getFormData = (itemValue?: Couple) => {
  if (itemValue) {
    const formData: FormData = {
      id: itemValue.id,
      partner1: itemValue.partner1,
      partner2: itemValue.partner2,
      stillMarried: itemValue.stillMarried,
    };
    return formData;
  } else {
    return formSchema.getDefault();
  }
};

const { meta, isSubmitting, handleSubmit, errors } = useForm<FormData>({
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

const onDeleted = () => {
  deleteConfirmDialog.value = false;
  emit("deleted");
};

watch(
  errors,
  (newErrors) => {
    console.log(newErrors);
  },
  { immediate: true }
);
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
      <AppSelect
        label="Partner 1"
        name="partner1"
        :options="individuals"
        option-id="id"
        option-text="fullName"
        return-value
      ></AppSelect>
      <AppSelect
        label="Partner 2"
        name="partner2"
        :options="individuals"
        option-id="id"
        option-text="fullName"
        return-value
      ></AppSelect>
      <AppSwitch name="stillMarried" label="Still married" right-label>
      </AppSwitch>
    </div>
    <AppDeleteConfirmDialog
      v-model:show="deleteConfirmDialog"
      :delete-action="deleteItem"
      @deleted="onDeleted"
    >
      Are you sure you want to delete the couple:
      <strong
        >{{ item?.partner1.fullName }} & {{ item?.partner2.fullName }}</strong
      >? This action cannot be undone.
    </AppDeleteConfirmDialog>
  </AppForm>
</template>
