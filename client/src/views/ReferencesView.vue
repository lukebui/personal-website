<script setup lang="ts">
import AppDefaultLayout from "@/components/AppDefaultLayout.vue";
import AppLink from "@/components/AppLink.vue";
import { RouteNames } from "@/enums";
import { NavigationBarLinkGroup } from "@/types";

const items: NavigationBarLinkGroup[] = [
  new NavigationBarLinkGroup("Contacts", [
    { name: "All contacts", to: { name: RouteNames.CONTACTS } },
    { name: "Parent types", to: { name: RouteNames.CONTACTS_PARENT_TYPES } },
  ]),
];
</script>

<template>
  <AppDefaultLayout>
    <div class="default-spacing flex flex-wrap gap-12 sm:gap-24">
      <div v-for="(item, itemIndex) in items" :key="itemIndex">
        <div>
          <h3 class="text-base font-medium text-white">{{ item.name }}</h3>
          <ul role="list" class="mt-4 space-y-2">
            <li v-for="(link, linkIndex) in item.children" :key="linkIndex">
              <AppLink
                class="text-base text-gray-300 hover:text-white"
                :to="link.to"
              >
                {{ link.name }}
              </AppLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AppDefaultLayout>
</template>
