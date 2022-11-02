<script setup lang="ts">
import AppDefaultLayout from "../components/Layouts/AppDefaultLayout.vue";
import { useContactsStore, type IndividualWithParents } from "@/store/contacts";
import { computed, onBeforeMount, ref, watch } from "vue";
import AppCard from "@/components/Base/AppCard.vue";
import AppHeading from "@/components/Base/AppHeading.vue";
import moment from "moment";
import AddIndividualDialog from "@/components/Contacts/EditIndividualDialog.vue";
import ViewIndividualDialog from "@/components/Contacts/ViewIndividualDialog.vue";

const contactsStore = useContactsStore();

const individualsWithParents = computed(() => {
  return contactsStore.individualsWithParents;
});

const individualToView = ref<IndividualWithParents>();

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
  formKey.value++;
  addDialog.value = true;
};

const viewItem = (item: IndividualWithParents) => {
  individualToView.value = item;
  formKey.value++;
  viewDialog.value = true;
};

const addDialog = ref(false);
const viewDialog = ref(false);

watch([addDialog, viewDialog], () => {
  fetch();
});
</script>

<template>
  <AppDefaultLayout>
    <div class="default-spacing py-4 sm:py-10">
      <div class="space-y-4">
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
            @click="viewItem(individual)"
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
              </div>
            </AppCard>
          </button>
        </div>
      </div>
    </div>
    <AddIndividualDialog v-model:show="addDialog"></AddIndividualDialog>
    <ViewIndividualDialog
      v-model:show="viewDialog"
      :individual="individualToView"
      @changed="fetch"
    ></ViewIndividualDialog>
  </AppDefaultLayout>
</template>
