<script setup lang="ts">
import AppDefaultLayout from "../components/AppDefaultLayout.vue";
import { type Individual, useContactsStore } from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import ContactsEditIndividualForm from "../components/ContactsEditIndividualForm.vue";
import AppDialog from "@/components/AppDialog.vue";
import AppButton from "@/components/AppButton.vue";
import { ComponentColor } from "@/enums";
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

const addItem = () => {
  individualToEdit.value = undefined;
  formKey.value++;
  editDialog.value = true;
};

const editItem = (item: Individual) => {
  individualToEdit.value = item;
  formKey.value++;
  editDialog.value = true;
};

const closeDialog = () => {
  editDialog.value = false;
  return fetch();
};

const editDialog = ref(false);
</script>

<template>
  <AppDefaultLayout>
    <div class="container mx-auto px-2 sm:px-6 lg:px-8">
      <div class="space-y-4 py-10">
        <div class="md:flex md:items-center md:justify-between">
          <div class="min-w-0 flex-1">
            <h2
              class="text-2xl font-bold leading-7 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
            >
              Manage Contacts
            </h2>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <AppButton @click="addItem" :color="ComponentColor.PRIMARY">
              Add
            </AppButton>
          </div>
        </div>
        <AppCard>
          <div class="flex flex-wrap justify-center gap-2 md:justify-start">
            <AppButton
              v-for="individual in individuals"
              :key="individual.id"
              @click="editItem(individual)"
              class="w-full max-w-xs cursor-pointer rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div class="h-full w-full">
                <div class="max-w-full text-left text-base font-normal">
                  <p class="text-2xl">
                    <span class="font-semibold">
                      {{
                        [
                          individual.lastName,
                          individual.middleName,
                          individual.firstName,
                        ].join(" ")
                      }}
                    </span>
                    <span v-if="individual.alias" class="font-light">
                      ({{ individual.alias }})
                    </span>
                  </p>
                  <p>Gender: {{ individual.gender }}</p>
                  <p v-if="individual.dateOfBirth">
                    Date of birth: {{ individual.dateOfBirth }}
                  </p>
                  <p v-if="individual.hasDied">Has died</p>
                  <p v-if="individual.dateOfDeath">
                    Date of death: {{ individual.dateOfDeath }}
                  </p>
                  <p v-if="individual.note" class="truncate">
                    Note: {{ individual.note }}
                  </p>
                </div>
              </div>
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
    <AppDialog v-model="editDialog">
      <ContactsEditIndividualForm
        :key="formKey"
        :item="individualToEdit"
        @saved="closeDialog"
        @deleted="closeDialog"
        @cancelled="closeDialog"
      />
    </AppDialog>
  </AppDefaultLayout>
</template>
