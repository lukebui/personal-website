<script setup lang="ts">
import AppDefaultLayout from "../components/Layouts/AppDefaultLayout.vue";
import { useContactsStore, type Individual } from "@/store/contacts";
import { computed, onBeforeMount, ref, watch } from "vue";
import AppHeading from "@/components/Base/AppHeading.vue";
import moment from "moment";
import AddIndividualDialog from "@/components/Contacts/Individuals/EditIndividualDialog.vue";
import AppSimpleTable from "@/components/Base/AppSimpleTable.vue";
import AppButton from "@/components/Base/AppButton.vue";
import { ComponentColor } from "@/enums";
import EditIndividualDialog from "@/components/Contacts/Individuals/EditIndividualDialog.vue";

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals || []);
const couples = computed(() => contactsStore.couples || []);
const parentalLinks = computed(() => contactsStore.parentalLinks || []);

const individualToView = ref<Individual>();

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
  await contactsStore.fetch();
};

onBeforeMount(async () => {
  await fetch();
});

const formKey = ref(0);

const addItem = () => {
  formKey.value++;
  addDialog.value = true;
};

const editItem = (item: Individual) => {
  individualToView.value = item;
  formKey.value++;
  editDialog.value = true;
};

const addDialog = ref(false);
const editDialog = ref(false);

watch([addDialog, editDialog], (values) => {
  if (!values[0] && !values[1]) {
    fetch();
  }
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
            :actions="[{ name: 'Add', action: addItem, primary: true }]"
          />
          <AppSimpleTable v-if="individuals.length">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Nickname</th>
                <th>Gender</th>
                <th>Birthday</th>
                <th>Has died</th>
                <th>Date of death</th>
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="individual in individuals" :key="individual.id">
                <td>{{ individual.id }}</td>
                <td>{{ individual.fullName }}</td>
                <td>{{ individual.alias }}</td>
                <td>{{ individual.gender }}</td>
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
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="editItem(individual)"
                  >
                    Edit
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div class="space-y-2">
          <AppHeading title="Couples" />
          <AppSimpleTable v-if="couples.length">
            <thead>
              <tr>
                <th>Id</th>
                <th>Partner 1</th>
                <th>Partner 2</th>
                <th>Marriage status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="couple in couples" :key="couple.id">
                <td>
                  {{ couple.id }}
                </td>
                <td>
                  {{ couple.partner1.fullName }}
                </td>
                <td>
                  {{ couple.partner2.fullName }}
                </td>
                <td>
                  {{ couple.stillMarried ? "Married" : "Divorced" }}
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div class="space-y-2">
          <AppHeading title="Parental links" />
          <AppSimpleTable v-if="parentalLinks.length">
            <thead>
              <tr>
                <th>Id</th>
                <th>Child</th>
                <th>Parents</th>
                <th>Parental type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="parentalLink in parentalLinks" :key="parentalLink.id">
                <td>{{ parentalLink.id }}</td>
                <td>
                  {{ parentalLink.child.fullName }}
                </td>
                <td>
                  {{
                    [
                      parentalLink.parentCouple.partner1.fullName,
                      parentalLink.parentCouple.partner2.fullName,
                    ].join(" - ")
                  }}
                </td>
                <td>
                  {{ parentalLink.type.type }}
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>
      </div>
    </div>
  </AppDefaultLayout>
  <AddIndividualDialog v-model:show="addDialog"></AddIndividualDialog>
  <EditIndividualDialog
    v-model:show="editDialog"
    :item="individualToView"
    @saved="fetch"
    @deleted="fetch"
  />
</template>
