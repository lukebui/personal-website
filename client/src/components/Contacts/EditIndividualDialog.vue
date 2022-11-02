<script setup lang="ts">
import type { IndividualWithParents } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import ContactsEditIndividualForm from "./EditIndividualForm.vue";
import AppDialog from "@/components/Base/AppDialog.vue";
import { ComponentSize } from "@/enums";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<IndividualWithParents>,
});

const emit = defineEmits(["update:show", "saved"]);

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
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.X_LARGE">
    <ContactsEditIndividualForm
      :item="item"
      @close="dialog = false"
      @saved="onSaved"
      :key="formKey"
    />
  </AppDialog>
</template>
