<script setup lang="ts">
import AppDefaultLayout from "../components/Layouts/AppDefaultLayout.vue";
import { useContactsStore, type Individual } from "@/store/contacts";
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import moment from "moment";
import { AppHeading, AppSimpleTable, AppButton } from "@/components/Base";
import { ComponentColor } from "@/enums";
import AddIndividualDialog from "@/components/Contacts/Individuals/EditIndividualDialog.vue";
import ViewIndividualDialog from "@/components/Contacts/Individuals/ViewIndividualDialog.vue";

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals || []);

const isFetching = ref(false);

const fetch = async () => {
  try {
    isFetching.value = true;

    await contactsStore.fetch();
  } catch (error) {
    alert(error);
  } finally {
    isFetching.value = false;
  }
};

onBeforeMount(async () => {
  await fetch();
});

const individualToEdit = ref<Individual>();

const addIndividual = () => {
  if (viewIndividualDialog.value) {
    viewIndividualDialog.value = false;

    setTimeout(() => {
      individualToEdit.value = undefined;
      editIndividualDialog.value = true;
    }, 350);
  } else {
    individualToEdit.value = undefined;
    editIndividualDialog.value = true;
  }
};

const viewIndividual = (item: Individual) => {
  individualToEdit.value = item;
  viewIndividualDialog.value = true;
};

const editIndividualDialog = ref(false);
const viewIndividualDialog = ref(false);

const onAdded = async (individual: Individual) => {
  await fetch();
  const selectedIndividual = individuals.value.find(
    (tempIndividual) => tempIndividual.id === individual.id
  );

  if (selectedIndividual) {
    individualToEdit.value = selectedIndividual;
    viewIndividualDialog.value = true;
  }
};

const onF2Keyup = (event: KeyboardEvent) => {
  if (event.key === "F2") {
    addIndividual();
  }
};

onMounted(() => {
  window.addEventListener("keyup", onF2Keyup);
});

onUnmounted(() => {
  window.removeEventListener("keyup", onF2Keyup);
});
</script>

<template>
  <AppDefaultLayout>
    <div class="default-spacing py-4 sm:py-10">
      <div v-if="isFetching">Loading...</div>
      <div v-else class="space-y-6">
        <div class="space-y-2">
          <AppHeading
            title="Individuals"
            :actions="[
              {
                name: 'Add',
                action: addIndividual,
                primary: true,
              },
            ]"
          />
          <AppSimpleTable v-if="individuals.length">
            <thead>
              <tr>
                <th>Name</th>
                <th>Nickname</th>
                <th>Gender</th>
                <th>Birthday</th>
                <th>Has died</th>
                <th>Date of death</th>
                <th>Note</th>
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="individual in individuals" :key="individual.id">
                <td>{{ individual.fullName }}</td>
                <td>{{ individual.alias }}</td>
                <td>
                  {{
                    individual.gender === "male"
                      ? "Male"
                      : individual.gender === "female"
                      ? "Female"
                      : ""
                  }}
                </td>
                <td>
                  {{
                    individual.dateOfBirth
                      ? moment(individual.dateOfBirth).format("DD/MM/YYYY")
                      : ""
                  }}
                </td>
                <td>{{ individual.hasDied }}</td>
                <td>
                  {{
                    individual.dateOfDeath
                      ? moment(individual.dateOfDeath).format("DD/MM/YYYY")
                      : ""
                  }}
                </td>
                <td>
                  <p class="max-w-xs truncate">{{ individual.note }}</p>
                </td>
                <td class="simple-table-actions">
                  <div
                    class="inline-flex flex-wrap items-center gap-2 sm:gap-4"
                  >
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="viewIndividual(individual)"
                    >
                      View
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>
      </div>
    </div>
  </AppDefaultLayout>
  <ViewIndividualDialog
    v-model:show="viewIndividualDialog"
    :item="individualToEdit"
    @changed="fetch"
  />
  <AddIndividualDialog
    v-model:show="editIndividualDialog"
    :item="individualToEdit"
    @saved="onAdded"
    @deleted="fetch"
  />
</template>
