<script setup lang="ts">
import { AppButton, AppDialog } from "@/components/Base";
import { ComponentColor } from "@/enums";
import { computed, toRefs } from "vue";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["update:show", "create", "link"]);

const { show } = toRefs(props);

const dialog = computed({
  get() {
    return show.value;
  },
  set(value) {
    emit("update:show", value);
  },
});
</script>

<template>
  <AppDialog v-model="dialog">
    <div class="space-y-4">
      <p>How to you like to add parents to this individual?</p>
      <div class="flex flex-wrap gap-2 sm:justify-end">
        <AppButton
          class="w-full sm:w-auto"
          @click="$emit('create')"
          :color="ComponentColor.PRIMARY"
        >
          Create new
        </AppButton>
        <AppButton
          class="w-full sm:w-auto"
          @click="$emit('link')"
          :color="ComponentColor.SECONDARY"
        >
          Link to an existing couple
        </AppButton>
      </div>
    </div>
  </AppDialog>
</template>
