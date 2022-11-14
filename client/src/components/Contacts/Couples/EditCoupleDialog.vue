<script setup lang="ts">
import type { Couple, Individual } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import { AppDialog } from "@/components/Base";
import { ComponentSize } from "@/enums";
import EditCoupleForm from "./EditCoupleForm.vue";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Couple>,
  fromIndividuals: Array as PropType<Individual[]>,
});

const emit = defineEmits<{
  (event: "update:show", value: boolean): void;
  (event: "saved", value: Couple): void;
  (event: "deleted"): void;
}>();

const { show } = toRefs(props);

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

const onSaved = (couple: Couple) => {
  emit("saved", couple);
  dialog.value = false;
};

const onDelete = () => {
  dialog.value = false;
  emit("deleted");
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.SMALL">
    <EditCoupleForm
      :item="item"
      :from-individuals="fromIndividuals"
      @close="dialog = false"
      @saved="onSaved"
      @deleted="onDelete"
      :key="formKey"
    >
    </EditCoupleForm>
  </AppDialog>
</template>
