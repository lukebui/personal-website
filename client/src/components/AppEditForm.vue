<script setup lang="ts">
import { useForm } from "vee-validate";
import { ref, toRefs, watch, type PropType } from "vue";
import type * as yup from "yup";
import AppButton from "./AppButton.vue";
import { ButtonType, ComponentColor } from "@/enums";

const props = defineProps({
  formSchema: { type: Object as PropType<yup.AnySchema>, required: true },
  initialValues: { type: Object },
  saveItem: {
    type: Function as PropType<
      (formData: unknown, item?: unknown) => void | Promise<void>
    >,
    required: true,
  },
  deleteItem: {
    type: Function as PropType<() => void | Promise<void>>,
    required: false,
  },
});

const emit = defineEmits(["cancelled", "saved", "deleted"]);

const isDeleting = ref(false);

const { formSchema, saveItem, deleteItem, initialValues } = toRefs(props);

type FormData = yup.InferType<typeof formSchema.value>;

const { handleSubmit, meta, resetForm, values, isSubmitting } =
  useForm<FormData>({
    validationSchema: formSchema,
    initialValues: initialValues,
  });

const onSubmit = handleSubmit(async (values) => {
  try {
    const formData = formSchema.value.cast(values);

    await saveItem.value(formData);

    emit("saved");
  } catch (error) {
    alert(error);
  }
});

const onDelete = async () => {
  try {
    isDeleting.value = true;

    await deleteItem?.value?.();

    emit("deleted");
  } catch (error) {
    alert(error);
  } finally {
    isDeleting.value = false;
  }
};

const onCancel = () => {
  emit("cancelled");
};

watch(
  () => initialValues?.value,
  (newInitialValues) => {
    if (newInitialValues) {
      resetForm(newInitialValues);
    } else {
      resetForm();
    }
  }
);
</script>

<template>
  <form @submit="onSubmit">
    <fieldset class="min-w-0" :disabled="isDeleting || isSubmitting">
      <div>
        <slot :formData="values"></slot>
        <div class="flex justify-between gap-2 pt-2">
          <div class="flex gap-2">
            <AppButton
              :color="ComponentColor.PRIMARY"
              :type="ButtonType.SUBMIT"
              :disabled="!(meta.dirty && meta.valid)"
            >
              Save
            </AppButton>

            <AppButton
              v-if="deleteItem"
              :color="ComponentColor.ERROR"
              outline
              @click="onDelete"
            >
              Delete
            </AppButton>
          </div>
          <AppButton :color="ComponentColor.SECONDARY" @click="onCancel">
            Cancel
          </AppButton>
        </div>
      </div>
    </fieldset>
  </form>
</template>
