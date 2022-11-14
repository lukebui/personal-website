<script setup lang="ts">
import {
  AppForm,
  AppSelect,
  AppAutocomplete,
  AppDeleteConfirmDialog,
} from "@/components/Base";
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
import { useForm } from "vee-validate";
import { parentalLinkSchema } from "@/schemas";
import { useErrorMessages } from "@/composables";

const props = defineProps({
  item: { type: Object as PropType<ParentalLink> },
  fromChild: Object as PropType<Individual>,
  fromCouple: Object as PropType<Couple>,
});

const emit = defineEmits<{
  (event: "close"): void;
  (event: "saved", value: ParentalLink): void;
  (event: "deleted"): void;
}>();

const { item, fromChild, fromCouple } = toRefs(props);

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals);
const couples = computed(() => contactsStore.couples);
const parentalTypes = computed(() => contactsStore.parentalTypes);
const parentalLinks = computed(() => contactsStore.parentalLinks);

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
  } else {
    return (await response.json()) as ParentalLink;
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
      olderSibling: itemValue.olderSibling,
    };
    return formData;
  } else {
    const formData = formSchema.getDefault();

    if (fromChild?.value) {
      formData.child = fromChild.value;
    }

    if (fromCouple?.value) {
      formData.parentCouple = fromCouple.value;
    }

    return formData;
  }
};

const { meta, isSubmitting, handleSubmit, useFieldModel } = useForm<FormData>({
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
      const parentalLink = await saveItem(values);

      emit("saved", parentalLink);
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

const getSiblingText = (parentalLink: ParentalLink) =>
  `${parentalLink.child.fullName} (${parentalLink.parentCouple.partner1.fullName} & ${parentalLink.parentCouple.partner2.fullName})`;

const selectedParents = useFieldModel("parentCouple");
const selectedChild = useFieldModel("child");

const availableSiblings = computed(() => {
  return parentalLinks.value.filter(
    (parentalLink) =>
      parentalLink.child.id !== selectedChild.value?.id &&
      parentalLink.parentCouple.id === selectedParents.value?.id
  );
});
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
        name="parentCouple"
        :options="couples"
        return-value
        option-id="id"
        :option-text="getCoupleName"
        label="Parents"
        required
        :disabled="!!fromCouple"
      ></AppAutocomplete>
      <AppAutocomplete
        name="child"
        :options="individuals"
        return-value
        option-id="id"
        :option-text="getIndividualName"
        label="Child"
        required
        :disabled="!!fromChild"
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
      <AppAutocomplete
        name="olderSibling"
        :options="availableSiblings"
        return-value
        option-id="id"
        :option-text="getSiblingText"
        label="Immediate older sibling"
        nullable
      ></AppAutocomplete>
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
