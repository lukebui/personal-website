<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
  toRefs,
  watch,
  type PropType,
} from "vue";
import { useElementSize } from "@vueuse/core";
import { ComponentColor, ComponentSize } from "@/enums";

const props = defineProps({
  progress: { type: Number, default: 0 },
  max: {
    type: Number,
    default: 100,
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: ComponentSize.MEDIUM,
  },
  color: {
    type: String as PropType<ComponentColor>,
    default: ComponentColor.PRIMARY,
  },
  continuous: Boolean,
  rounded: Boolean,
});

const { progress, max, size, color, continuous, rounded } = toRefs(props);

const progressComponent = ref<HTMLDivElement>();

const { width: maxWidth } = useElementSize(progressComponent);

const width = ref(0);
const offset = ref(0);

let continuousInterval = null as number | null;

const localProgress = computed(() => {
  return progress.value && max.value ? (progress.value / max.value) * 100 : 0;
});

const setContinuousWidth = () => {
  if (width.value !== maxWidth.value) {
    width.value = maxWidth.value;
    offset.value = 0;
  } else {
    if (offset.value <= maxWidth.value) {
      offset.value += 4;
    } else {
      offset.value = -maxWidth.value;
    }
  }
};

watch(
  [continuous, maxWidth, localProgress, max],
  ([newContinuous, newMaxWidth, newProgress, newMax]) => {
    if (continuousInterval !== null) {
      clearInterval(continuousInterval);
    }

    if (newContinuous) {
      width.value = newMaxWidth;
      continuousInterval = window.setInterval(setContinuousWidth, 6);
    } else {
      offset.value = 0;
      width.value = (newProgress / newMax) * newMaxWidth;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (continuousInterval !== null) {
    clearInterval(continuousInterval);
  }
});
</script>

<template>
  <div
    ref="progressComponent"
    :class="{
      'w-full overflow-hidden bg-gray-200 dark:bg-gray-700': true,
      'h-[3px]': size === ComponentSize.X_SMALL,
      'h-1.5': size === ComponentSize.SMALL,
      'h-2.5': size === ComponentSize.MEDIUM,
      'h-4': size === ComponentSize.LARGE,
      'h-6': size === ComponentSize.X_LARGE,
      'rounded-full': rounded,
    }"
  >
    <input class="peer hidden" />
    <div
      :class="{
        'peer-disabled:opacity-50': true,
        'h-[3px]': size === ComponentSize.X_SMALL,
        'h-1.5': size === ComponentSize.SMALL,
        'h-2.5': size === ComponentSize.MEDIUM,
        'h-4': size === ComponentSize.LARGE,
        'h-6': size === ComponentSize.X_LARGE,
        'bg-indigo-500': color === ComponentColor.PRIMARY,
        'bg-gray-500': color === ComponentColor.SECONDARY,
        'bg-green-500': color === ComponentColor.SUCCESS,
        'bg-red-500': color === ComponentColor.ERROR,
        'bg-amber-500': color === ComponentColor.WARNING,
        'bg-cyan-500': color === ComponentColor.INFO,
        'rounded-full': rounded,
      }"
      :style="{
        width: `${width}px`,
        transform: `translateX(${offset}px)`,
      }"
    ></div>
  </div>
</template>
