<script setup lang="ts">
import { computed, ref, toRefs, type PropType } from "vue";
import { DialogTitle } from "@headlessui/vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import AppDialog from "./AppDialog.vue";
import AppButton from "./AppButton.vue";
import { ComponentColor } from "@/enums";
import { useErrorMessages } from "@/composables";
import AppAlert from "./AppAlert.vue";

const props = defineProps({
  show: Boolean,
  deleteAction: {
    type: Function as PropType<() => Promise<void> | void>,
    required: true,
  },
});

const emit = defineEmits(["update:show", "deleted"]);

const { show, deleteAction } = toRefs(props);

const open = computed({
  get() {
    return show.value;
  },
  set(value) {
    emit("update:show", value);
  },
});

const isDeleting = ref(false);

const errors = ref<string[]>([]);

const { getErrorMessages } = useErrorMessages();

const onDelete = async () => {
  try {
    errors.value = [];
    isDeleting.value = true;

    await deleteAction.value();

    emit("deleted");
  } catch (error) {
    errors.value = getErrorMessages(error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <AppDialog v-model="open" :loading="isDeleting" :disabled="isDeleting">
    <div class="space-y-4 pt-2 pb-1">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-700 sm:mx-0 sm:h-10 sm:w-10"
        >
          <ExclamationTriangleIcon
            class="h-6 w-6 text-red-600 dark:text-white"
            aria-hidden="true"
          />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >Confirm delete</DialogTitle
          >
          <div class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-300">
              <slot>
                Are you sure you want to delete? This action cannot be undone.
              </slot>
            </p>
          </div>
        </div>
      </div>
      <AppAlert
        v-if="errors.length"
        title="Delete errors"
        :messages="errors"
        status="error"
      ></AppAlert>
      <div class="flex flex-col gap-3 pt-1 sm:mt-4 sm:flex-row-reverse">
        <AppButton :color="ComponentColor.ERROR" @click="onDelete">
          Delete
        </AppButton>
        <AppButton outline @click="open = false"> Cancel </AppButton>
      </div>
    </div>
  </AppDialog>
</template>
