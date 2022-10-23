<script setup lang="ts">
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineProps({
  isExternalLink: Boolean,
  to: {
    type: [String, Object] as PropType<string | RouteLocationRaw>,
    required: true,
  },
  activeClass: String,
  inactiveClass: String,
});
</script>

<template>
  <a
    v-if="isExternalLink && typeof to === 'string'"
    v-bind="$attrs"
    :href="to"
    target="_blank"
  >
    <slot />
  </a>
  <router-link v-else :to="to" custom v-slot="{ isActive, href, navigate }">
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot :isActive="isActive" />
    </a>
  </router-link>
</template>
