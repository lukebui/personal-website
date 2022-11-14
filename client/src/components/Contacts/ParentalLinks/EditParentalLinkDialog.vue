<script setup lang="ts">
import { AppDialog } from "@/components/Base";
import type { Couple, Individual, ParentalLink } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import { ComponentSize } from "@/enums";
import EditParentalLinkForm from "./EditParentalLinkForm.vue";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<ParentalLink>,
  fromChild: Object as PropType<Individual>,
  fromCouple: Object as PropType<Couple>,
});

const emit = defineEmits<{
  (event: "update:show", value: boolean): void;
  (event: "saved", value: ParentalLink): void;
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

const onSaved = (parentalLink: ParentalLink) => {
  emit("saved", parentalLink);
  dialog.value = false;
};

const onDelete = () => {
  dialog.value = false;
  emit("deleted");
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.SMALL">
    <EditParentalLinkForm
      :item="item"
      :from-child="fromChild"
      :from-couple="fromCouple"
      @close="dialog = false"
      @saved="onSaved"
      @deleted="onDelete"
      :key="formKey"
    >
    </EditParentalLinkForm>
  </AppDialog>
</template>
