<script setup lang="ts">
import AppDefaultLayout from "../components/AppDefaultLayout.vue";
import { type Individual, useContactsStore } from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import ContactsEditIndividualForm from "../components/ContactsEditIndividualForm.vue";
import AppCard from "@/components/AppCard.vue";

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

const formKey = ref(0);

const resetForm = () => {
  individualToEdit.value = undefined;
  formKey.value++;
};

const editItem = (item: Individual) => {
  individualToEdit.value = item;
  formKey.value++;
};

const onCancel = () => {
  resetForm();
  return fetch();
};

const onSave = () => {
  resetForm();
  return fetch();
};

const onDelete = () => {
  resetForm();
  return fetch();
};
</script>

<template>
  <AppDefaultLayout>
    <div class="container mx-auto px-2 sm:px-6 lg:px-8">
      <div class="py-10">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="individual in individuals"
            :key="individual.id"
            @click="editItem(individual)"
            class="flex-grow cursor-pointer"
          >
            <AppCard well class="h-full">
              <p>
                Name:
                {{
                  [
                    individual.lastName,
                    individual.middleName,
                    individual.firstName,
                  ].join(" ")
                }}
              </p>
              <p v-if="individual.alias">Alias: {{ individual.alias }}</p>
              <p>Gender: {{ individual.gender }}</p>
              <p v-if="individual.note">Note: {{ individual.note }}</p>
              <p v-if="individual.dateOfBirth">
                Date of birth: {{ individual.dateOfBirth }}
              </p>
              <p v-if="individual.hasDied">Has died</p>
              <p v-if="individual.dateOfDeath">
                Date of death: {{ individual.dateOfDeath }}
              </p>
            </AppCard>
          </div>
        </div>
        <div class="mx-auto max-w-lg">
          <ContactsEditIndividualForm
            :key="formKey"
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
