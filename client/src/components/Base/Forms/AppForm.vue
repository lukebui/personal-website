<script setup lang="ts">
import type { PropType } from "vue";
import AppButton from "../Elements/AppButton.vue";
import { ComponentColor } from "@/enums";
import AppAlert from "../Display/AppAlert.vue";

defineProps({
  canSave: Boolean,
  canDelete: Boolean,
  loading: Boolean,
  errors: Array as PropType<string[]>,
});

defineEmits(["cancel", "save", "delete"]);
</script>

<template>
  <form @submit.prevent>
    <fieldset class="min-w-0" :disabled="loading">
      <div>
        <slot></slot>
        <div v-if="errors?.length">
          <AppAlert
            :title="`There ${errors.length > 1 ? 'were' : 'was'} ${
              errors.length
            } ${errors.length > 1 ? 'errors' : 'error'} with your submission`"
            :messages="errors"
            status="error"
          />
        </div>
        <div class="flex justify-between gap-2 pt-2">
          <div class="flex gap-2">
            <AppButton
              :color="ComponentColor.PRIMARY"
              :disabled="!canSave"
              @click="$emit('save')"
            >
              Save
            </AppButton>

            <AppButton
              v-if="canDelete"
              :color="ComponentColor.ERROR"
              outline
              @click="$emit('delete')"
            >
              Delete
            </AppButton>
          </div>
          <AppButton :color="ComponentColor.SECONDARY" @click="$emit('cancel')">
            Cancel
          </AppButton>
        </div>
      </div>
    </fieldset>
  </form>
</template>
