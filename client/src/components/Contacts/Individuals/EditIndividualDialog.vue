<script setup lang="ts">
import type { Individual } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import ContactsEditIndividualForm from "./EditIndividualForm.vue";
import AppDialog from "@/components/Base/AppDialog.vue";
import { ComponentSize } from "@/enums";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Individual>,
});

const emit = defineEmits(["update:show", "saved", "deleted"]);

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

const onSaved = () => {
  emit("saved");
  dialog.value = false;
};

const onDelete = () => {
  dialog.value = false;
  emit("deleted");
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.MEDIUM">
    <ContactsEditIndividualForm
      :item="item"
      @close="dialog = false"
      @saved="onSaved"
      @deleted="onDelete"
      :key="formKey"
    />
  </AppDialog>
</template>
