<script setup lang="ts">
import type * as yup from "yup";
import {
  useContactsStore,
  type Couple,
  type Individual,
} from "@/store/contacts";
import { StorageSerializers, useStorage } from "@vueuse/core";
import { ComponentColor, LocalStorageKeys } from "@/enums";
import { computed, ref, toRefs, type PropType } from "vue";
import { useForm } from "vee-validate";
import { coupleSchema } from "@/schemas";
import { useErrorMessages } from "@/composables";
import {
  AppForm,
  AppDeleteConfirmDialog,
  AppSwitch,
  AppAutocomplete,
  AppButton,
} from "@/components/Base";
import { PlusIcon } from "@heroicons/vue/24/solid";
import EditIndividualDialog from "../Individuals/EditIndividualDialog.vue";

const props = defineProps({
  item: { type: Object as PropType<Couple> },
  fromIndividuals: Array as PropType<Individual[]>,
});

const emit = defineEmits<{
  (event: "close"): void;
  (event: "saved", value: Couple): void;
  (event: "deleted"): void;
}>();

const { item, fromIndividuals } = toRefs(props);

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals);

const isFetching = ref(false);

const fetchData = async () => {
  try {
    isFetching.value = true;

    await contactsStore.findAllIndividuals();
  } catch (error) {
    alert(error);
  } finally {
    isFetching.value = false;
  }
};

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
  } else {
    return (await response.json()) as Couple;
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
    const formData = formSchema.getDefault();
    if (fromIndividuals?.value) {
      if (fromIndividuals.value.length >= 1) {
        formData.partner1 = fromIndividuals.value[0];
      }
      if (fromIndividuals.value.length >= 2) {
        formData.partner2 = fromIndividuals.value[1];
      }
    }
    return formData;
  }
};

const { meta, isSubmitting, handleSubmit, useFieldModel } = useForm<FormData>({
  validationSchema: formSchema,
  initialValues: getFormData(item?.value),
});

const partner1 = useFieldModel("partner1");
const partner2 = useFieldModel("partner2");

const errorMessages = ref<string[]>([]);

const { getErrorMessages } = useErrorMessages();

const deleteConfirmDialog = ref(false);

const onSave = async () => {
  try {
    errorMessages.value = [];
    await handleSubmit(async (values) => {
      const couple = await saveItem(values);

      emit("saved", couple);
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

const editIndividualDialog = ref(false);
const partnerToAdd = ref<1 | 2>();

const addNewPartner1 = () => {
  partnerToAdd.value = 1;
  editIndividualDialog.value = true;
};

const addNewPartner2 = () => {
  partnerToAdd.value = 2;
  editIndividualDialog.value = true;
};

const onCreatedIndividual = async (individual: Individual) => {
  await fetchData();

  const matchedIndividual = individuals.value.find(
    (tempIndividual) => tempIndividual.id === individual.id
  );

  if (partnerToAdd.value && matchedIndividual) {
    if (partnerToAdd.value === 1) {
      partner1.value = matchedIndividual;
    } else {
      partner2.value = matchedIndividual;
    }
  }
};
</script>

<template>
  <AppForm
    :errors="errorMessages"
    :loading="isSubmitting || isFetching"
    :can-save="
      (meta.dirty || (fromIndividuals && fromIndividuals?.length >= 2)) &&
      meta.valid
    "
    :can-delete="!!item"
    @save="onSave"
    @delete="onDelete"
    @cancel="onCancel"
  >
    <div class="mb-4 space-y-3">
      <div class="flex items-end gap-2">
        <div class="flex-grow">
          <AppAutocomplete
            label="Partner 1"
            name="partner1"
            :options="individuals"
            option-id="id"
            option-text="fullName"
            return-value
            :disabled="fromIndividuals && fromIndividuals?.length >= 1"
          />
        </div>
        <AppButton
          round
          :color="ComponentColor.SECONDARY"
          :disabled="fromIndividuals && fromIndividuals?.length >= 1"
          @click="addNewPartner1"
        >
          <PlusIcon class="h-5 w-5" />
        </AppButton>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex-grow">
          <AppAutocomplete
            label="Partner 2"
            name="partner2"
            :options="individuals"
            option-id="id"
            option-text="fullName"
            return-value
            :disabled="fromIndividuals && fromIndividuals?.length >= 2"
          />
        </div>
        <AppButton
          round
          :color="ComponentColor.SECONDARY"
          :disabled="fromIndividuals && fromIndividuals?.length >= 2"
          @click="addNewPartner2"
        >
          <PlusIcon class="h-5 w-5" />
        </AppButton>
      </div>
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
    <EditIndividualDialog
      v-model:show="editIndividualDialog"
      @saved="onCreatedIndividual"
    />
  </AppForm>
</template>
