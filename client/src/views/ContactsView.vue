<script setup lang="ts">
import AppDefaultLayout from "../components/AppDefaultLayout.vue";
import { type Individual, useContactsStore } from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import ContactsEditIndividualForm from "../components/ContactsEditIndividualForm.vue";
import AppDialog from "@/components/AppDialog.vue";
import AppButton from "@/components/AppButton.vue";
import AppCard from "@/components/AppCard.vue";
import AppHeading from "@/components/AppHeading.vue";

const contactsStore = useContactsStore();

const individuals = computed(() => {
  return contactsStore.individuals;
});

const individualToEdit = ref<Individual>();

const fetch = async () => {
  await contactsStore.findAllIndividuals();
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
        <AppHeading
          title="Manage Contacts"
          :actions="[{ name: 'Add', action: addItem, primary: true }]"
        />
        <AppCard well>
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
