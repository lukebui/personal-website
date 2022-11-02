<script setup lang="ts">
import AppDefaultLayout from "../components/Base/AppDefaultLayout.vue";
import { useContactsStore, type IndividualWithParents } from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import ContactsEditIndividualForm from "../components/Contacts/EditIndividualForm.vue";
import AppDialog from "@/components/Base/AppDialog.vue";
import AppCard from "@/components/Base/AppCard.vue";
import AppHeading from "@/components/Base/AppHeading.vue";
import { ComponentSize } from "@/enums";
import moment from "moment";

const contactsStore = useContactsStore();

const individualsWithParents = computed(() => {
  return contactsStore.individualsWithParents;
});

const individualToEdit = ref<IndividualWithParents>();

const fetch = async () => {
  await Promise.all([
    contactsStore.findAllIndividuals(),
    contactsStore.findAllIndividualsWithParents(),
    contactsStore.findAllParentTypes(),
  ]);
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

const editItem = (item: IndividualWithParents) => {
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
        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <button
            v-for="individual in individualsWithParents"
            :key="individual.id"
            @click="editItem(individual)"
            class="rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <AppCard class="h-full" hover>
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
                  Date of birth:
                  {{ moment(individual.dateOfBirth).format("DD/MM/YYYY") }}
                </p>
                <p v-if="individual.hasDied">Has died</p>
                <p v-if="individual.dateOfDeath">
                  Date of death:
                  {{ moment(individual.dateOfDeath).format("DD/MM/YYYY") }}
                </p>
                <p v-if="individual.note" class="truncate">
                  Note: {{ individual.note }}
                </p>
              </div>
            </AppCard>
          </button>
        </div>
      </div>
    </div>
    <AppDialog v-model="editDialog" :size="ComponentSize.X_LARGE">
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
