<script setup lang="ts">
import AppCard from "@/components/Base/AppCard.vue";
import AppDefaultLayout from "@/components/Base/AppDefaultLayout.vue";
import AppLink from "@/components/Base/AppLink.vue";
import { RouteNames } from "@/enums";
import { StyledNavigationBarLinkGroup } from "@/types";

const items: StyledNavigationBarLinkGroup[] = [
  new StyledNavigationBarLinkGroup("Contacts", [
    { name: "All contacts", to: { name: RouteNames.CONTACTS } },
    { name: "Parent types", to: { name: RouteNames.CONTACTS_PARENT_TYPES } },
  ]),
];
</script>

<template>
  <AppDefaultLayout>
    <div class="default-spacing">
      <AppCard>
        <div class="flex flex-wrap gap-12 sm:gap-24">
          <div v-for="(item, itemIndex) in items" :key="itemIndex">
            <div>
              <h3 class="text-base font-medium dark:text-white">
                {{ item.name }}
              </h3>
              <ul role="list" class="mt-4 space-y-2">
                <li v-for="(link, linkIndex) in item.children" :key="linkIndex">
                  <AppLink
                    class="rounded text-base text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-white"
                    :to="link.to"
                  >
                    {{ link.name }}
                  </AppLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </AppDefaultLayout>
</template>
