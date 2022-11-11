<script setup lang="ts">
import type { Individual } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import EditIndividualForm from "./EditIndividualForm.vue";
import { AppDialog } from "@/components/Base";
import { ComponentSize } from "@/enums";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Individual>,
});

const emit = defineEmits<{
  (event: "update:show", value: boolean): void;
  (event: "saved", value: Individual): void;
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

const onSaved = (individual: Individual) => {
  emit("saved", individual);
  dialog.value = false;
};

const onDelete = () => {
  dialog.value = false;
  emit("deleted");
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.MEDIUM">
    <EditIndividualForm
      :item="item"
      @close="dialog = false"
      @saved="onSaved"
      @deleted="onDelete"
      :key="formKey"
    />
  </AppDialog>
</template>
