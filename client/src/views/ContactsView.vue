<script setup lang="ts">
import AppDefaultLayout from "../components/AppDefaultLayout.vue";
import { type Individual, useContactsStore } from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import ContactsEditIndividualForm from "../components/ContactsEditIndividualForm.vue";

const contactsStore = useContactsStore();

const individuals = computed(() => {
  return contactsStore.individuals;
});

const individualToEdit = ref<Individual>();

const fetch = async () => {
  await contactsStore.findAll();
};

onBeforeMount(async () => {
  await fetch();
});

const onCancel = () => {
  individualToEdit.value = undefined;
  return fetch();
};

const onSave = () => {
  individualToEdit.value = undefined;
  return fetch();
};

const onDelete = () => {
  individualToEdit.value = undefined;
  return fetch();
};
</script>

<template>
  <AppDefaultLayout>
    <div class="container mx-auto px-2 sm:px-6 lg:px-8">
      <div class="py-10">
        <div
          v-for="individual in individuals"
          :key="individual.id"
          @click="individualToEdit = individual"
          class="cursor-pointer"
        >
          <pre>{{ individual }}</pre>
        </div>
        <div class="mx-auto max-w-lg">
          <ContactsEditIndividualForm
            :item="individualToEdit"
            @saved="onSave"
            @deleted="onDelete"
            @cancelled="onCancel"
          />
        </div>
      </div>
    </div>
  </AppDefaultLayout>
</template>
