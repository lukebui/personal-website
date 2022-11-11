<script setup lang="ts">
import { computed, type PropType } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { toRefs } from "@vueuse/shared";
import { ComponentSize } from "@/enums";
import AppCard from "./AppCard.vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  size: {
    type: String as PropType<ComponentSize>,
    default: ComponentSize.MEDIUM,
  },
  full: Boolean,
  loading: Boolean,
  disabled: Boolean,
  top: Boolean,
});

const emit = defineEmits(["update:model-value"]);

const { modelValue } = toRefs(props);

const open = computed({
  get() {
    return modelValue.value;
  },
  set(value) {
    emit("update:model-value", value);
  },
});

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <TransitionRoot as="template" :show="open" unmount>
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-lg transition-opacity dark:bg-gray-900 dark:bg-opacity-50 dark:backdrop-blur-2xl dark:backdrop-brightness-75"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full w-full justify-center text-center"
          :class="{
            'p-4': !full,
            'items-start': top,
            'items-end sm:items-center': !top,
          }"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            :enter-from="
              top
                ? 'opacity-0 -translate-y-1/4 sm:scale-95'
                : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            "
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            :leave-to="
              top
                ? 'opacity-0 -translate-y-1/4 sm:scale-95'
                : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            "
          >
            <DialogPanel
              class="relative transform text-left shadow-xl transition-all"
              :class="{
                'w-full sm:my-8 sm:max-w-xs':
                  size === ComponentSize.X_SMALL && !full,
                'w-full sm:my-8 sm:max-w-sm':
                  size === ComponentSize.SMALL && !full,
                'w-full sm:my-8 sm:max-w-xl':
                  size === ComponentSize.MEDIUM && !full,
                'w-full sm:my-8 sm:max-w-4xl':
                  size === ComponentSize.LARGE && !full,
                'w-full sm:my-8 sm:max-w-6xl':
                  size === ComponentSize.X_LARGE && !full,
                'h-screen w-screen': full,
              }"
            >
              <AppCard
                :loading="loading"
                :disabled="disabled"
                :full="full"
                :round="full ? false : undefined"
              >
                <slot :close="closeDialog"></slot>
              </AppCard>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
