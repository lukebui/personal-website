<script setup lang="ts">
import type { Couple } from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import AppDialog from "@/components/Base/Layouts/AppDialog.vue";
import { ComponentSize } from "@/enums";
import EditCoupleForm from "./EditCoupleForm.vue";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Couple>,
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
  <AppDialog v-model="dialog" :size="ComponentSize.SMALL">
    <EditCoupleForm
      :item="item"
      @close="dialog = false"
      @saved="onSaved"
      @deleted="onDelete"
      :key="formKey"
    >
    </EditCoupleForm>
  </AppDialog>
</template>
