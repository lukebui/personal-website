<script setup lang="ts">
import { computed, toRefs } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  // @ts-ignore
  ...RouterLink.props,
  inactiveClass: String,
});

defineEmits(["navigate"]);

const { to } = toRefs(props);

const isExternalLink = computed(() => {
  return typeof to.value === "string" && to.value.startsWith("http");
});
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
});
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>

  <router-link
    v-else
    :="$props"
    :to="to"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="
        (event) => {
          $emit('navigate');
          navigate(event);
        }
      "
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot :isActive="isActive" />
    </a>
  </router-link>
</template>
