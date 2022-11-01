<script setup lang="ts">
import AppDefaultLayout from "../components/AppDefaultLayout.vue";
import { type Individual, useContactsStore } from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import ContactsEditIndividualForm from "../components/ContactsEditIndividualForm.vue";
import AppDialog from "@/components/AppDialog.vue";
import AppCard from "@/components/AppCard.vue";
import AppHeading from "@/components/AppHeading.vue";
import _ from "lodash";

const contactsStore = useContactsStore();

const individuals = computed(() => {
  return contactsStore.individuals;
});

const parentRelationships = computed(() => {
  return contactsStore.parents;
});

const contacts = computed(() => {
  return individuals.value.map((individual) => {
    const individualParents = parentRelationships.value.filter(
      (parent) => parent.child.id === individual.id
    );

    const parentTypes = _.uniqBy(
      individualParents.map((parent) => parent.type),
      _.property("id")
    );

    return {
      ...individual,
      parents: parentTypes.map((type) => {
        return {
          type,
          parents: individualParents
            .filter(
              (parentRelationship) => parentRelationship.type.id === type.id
            )
            .map((parentRelationship) => parentRelationship.parent),
        };
      }),
    };
  });
});

const individualToEdit = ref<Individual>();

const fetch = async () => {
  await Promise.all([
    contactsStore.findAllIndividuals(),
    contactsStore.findAllParents(),
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
        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <button
            v-for="contact in contacts"
            :key="contact.id"
            @click="editItem(contact)"
            class="rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <AppCard class="h-full" hover>
              <div class="max-w-full text-left text-base font-normal">
                <p class="text-2xl">
                  <span class="font-semibold">
                    {{
                      [
                        contact.lastName,
                        contact.middleName,
                        contact.firstName,
                      ].join(" ")
                    }}
                  </span>
                  <span v-if="contact.alias" class="font-light">
                    ({{ contact.alias }})
                  </span>
                </p>
                <p>Gender: {{ contact.gender }}</p>
                <p v-if="contact.dateOfBirth">
                  Date of birth: {{ contact.dateOfBirth }}
                </p>
                <p v-if="contact.hasDied">Has died</p>
                <p v-if="contact.dateOfDeath">
                  Date of death: {{ contact.dateOfDeath }}
                </p>
                <p v-if="contact.note" class="truncate">
                  Note: {{ contact.note }}
                </p>
                <p
                  v-for="(
                    parentRelationship, parentRelationshipIndex
                  ) in contact.parents"
                  :key="parentRelationshipIndex"
                >
                  {{ parentRelationship.type.type }}:
                  {{
                    parentRelationship.parents
                      .map((parent) =>
                        [
                          parent.lastName,
                          parent.middleName,
                          parent.firstName,
                          `(${parent.alias})`,
                        ].join(" ")
                      )
                      .join(", ")
                  }}
                </p>
              </div>
            </AppCard>
          </button>
        </div>
      </div>
    </div>
    <AppDialog v-model="editDialog">
      <AppCard well>
        <ContactsEditIndividualForm
          :key="formKey"
          :item="individualToEdit"
          @saved="closeDialog"
          @deleted="closeDialog"
          @cancelled="closeDialog"
        />
      </AppCard>
    </AppDialog>
  </AppDefaultLayout>
</template>
