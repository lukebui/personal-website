<script setup lang="ts">
import AppForm from "../../Base/AppForm.vue";
import type * as yup from "yup";
import {
  useContactsStore,
  type Couple,
  type Individual,
  type ParentalLink,
  type ParentalType,
} from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { LocalStorageKeys } from "@/enums";
import { computed, ref, toRefs, type PropType } from "vue";
import AppSelect from "../../Base/AppSelect.vue";
import AppAutocomplete from "../../Base/AppAutocomplete.vue";
import { useForm } from "vee-validate";
import { parentalLinkSchema } from "@/schemas";
import { useErrorMessages } from "@/composables";
import AppDeleteConfirmDialog from "../../Base/AppDeleteConfirmDialog.vue";

const props = defineProps({
  item: { type: Object as PropType<ParentalLink> },
});

const emit = defineEmits(["close", "saved", "deleted"]);

const { item } = toRefs(props);

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals);
const couples = computed(() => contactsStore.couples);
const parentalTypes = computed(() => contactsStore.parentalTypes);

const formSchema = parentalLinkSchema;

type FormData = yup.InferType<typeof formSchema>;

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const saveItem = async (values: FormData) => {
  const response = await fetch(
    `http://localhost:3000/v1/parental-links${
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
    `http://localhost:3000/v1/parental-links/${item.value.id}`,
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

const getFormData = (itemValue?: ParentalLink) => {
  if (itemValue) {
    const formData: FormData = {
      id: itemValue.id,
      type: itemValue.type,
      parentCouple: itemValue.parentCouple,
      child: itemValue.child,
    };
    return formData;
  } else {
    return formSchema.getDefault();
  }
};

const { meta, isSubmitting, handleSubmit } = useForm<FormData>({
  validationSchema: formSchema,
  initialValues: getFormData(item?.value) as any,
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

const getIndividualName = (individual: Individual) => individual.fullName;

const getCoupleName = (couple: Couple) => {
  return couple.partner1.fullName && couple.partner2.fullName
    ? [couple.partner1.fullName, couple.partner2.fullName].join(" - ")
    : "";
};

const getParentalTypeText = (type: ParentalType) => type.type;
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
      <AppAutocomplete
        name="child"
        :options="individuals"
        return-value
        option-id="id"
        :option-text="getIndividualName"
        label="Child"
        required
      ></AppAutocomplete>
      <AppAutocomplete
        name="parentCouple"
        :options="couples"
        return-value
        option-id="id"
        :option-text="getCoupleName"
        label="Parents"
        required
      ></AppAutocomplete>
      <AppSelect
        name="type"
        :options="parentalTypes"
        return-value
        option-id="id"
        :option-text="getParentalTypeText"
        label="Type"
        required
      ></AppSelect>
    </div>
    <AppDeleteConfirmDialog
      v-model:show="deleteConfirmDialog"
      :delete-action="deleteItem"
      @deleted="onDeleted"
    >
      Are you sure you want to delete the parental link between:
      <strong
        >{{ item?.parentCouple.partner1.fullName }},
        {{ item?.parentCouple.partner2.fullName }}, &
        {{ item?.child.fullName }}</strong
      >? This action cannot be undone.
    </AppDeleteConfirmDialog>
  </AppForm>
</template>
