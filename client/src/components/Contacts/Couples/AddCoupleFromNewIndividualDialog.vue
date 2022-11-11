<script setup lang="ts">
import type { Couple, Individual } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import { AppDialog } from "@/components/Base";
import { ComponentSize, LocalStorageKeys } from "@/enums";
import EditIndividualForm from "../Individuals/EditIndividualForm.vue";
import type * as yup from "yup";
import type { coupleSchema } from "@/schemas";
import { StorageSerializers, useStorage } from "@vueuse/core";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Couple>,
  fromIndividual: { type: Object as PropType<Individual>, required: true },
});

const emit = defineEmits(["update:show", "added"]);

const { show, fromIndividual } = toRefs(props);

const dialog = computed({
  get() {
    return show.value;
  },
  set(value) {
    emit("update:show", value);
  },
});

const formKey = ref(0);

watch(show, () => {
  formKey.value++;
});

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const onSaved = async (individual: Individual) => {
  try {
    type CreateCoupleFormData = yup.InferType<typeof coupleSchema>;

    const newCouple: CreateCoupleFormData = {
      id: undefined,
      partner1: fromIndividual.value,
      partner2: individual,
      stillMarried: true,
    };

    const response = await fetch(`http://localhost:3000/v1/couples`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCouple),
    });

    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    emit("added");
  } catch (error) {
    alert(error);
  } finally {
    dialog.value = false;
  }
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.MEDIUM">
    <EditIndividualForm
      @close="dialog = false"
      @saved="onSaved"
      :key="formKey"
    />
  </AppDialog>
</template>
