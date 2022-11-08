<script setup lang="ts">
import AppDefaultLayout from "../components/Layouts/AppDefaultLayout.vue";
import {
  useContactsStore,
  type Couple,
  type Individual,
  type ParentalLink,
} from "@/store/contacts";
import { computed, onBeforeMount, ref } from "vue";
import AppHeading from "@/components/Base/AppHeading.vue";
import moment from "moment";
import AppSimpleTable from "@/components/Base/AppSimpleTable.vue";
import AppButton from "@/components/Base/AppButton.vue";
import { ComponentColor } from "@/enums";
import EditIndividualDialog from "@/components/Contacts/Individuals/EditIndividualDialog.vue";
import EditCoupleDialog from "@/components/Contacts/Couples/EditCoupleDialog.vue";
import EditParentalLinkDialog from "@/components/Contacts/ParentalLinks/EditParentalLinkDialog.vue";

const contactsStore = useContactsStore();

const individuals = computed(() => contactsStore.individuals || []);
const couples = computed(() => contactsStore.couples || []);
const parentalLinks = computed(() => contactsStore.parentalLinks || []);

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

const individualToEdit = ref<Individual>();

const addIndividual = () => {
  individualToEdit.value = undefined;
  formKey.value++;
  editIndividualDialog.value = true;
};

const editIndividual = (item: Individual) => {
  individualToEdit.value = item;
  formKey.value++;
  editIndividualDialog.value = true;
};

const editIndividualDialog = ref(false);

const coupleToEdit = ref<Couple>();

const addCouple = () => {
  coupleToEdit.value = undefined;
  formKey.value++;
  editCoupleDialog.value = true;
};

const editCouple = (item: Couple) => {
  coupleToEdit.value = item;
  formKey.value++;
  editCoupleDialog.value = true;
};

const editCoupleDialog = ref(false);

const parentalLinkToEdit = ref<ParentalLink>();

const addParentalLink = () => {
  parentalLinkToEdit.value = undefined;
  formKey.value++;
  editParentalLinkDialog.value = true;
};

const editParentalLink = (item: ParentalLink) => {
  parentalLinkToEdit.value = item;
  formKey.value++;
  editParentalLinkDialog.value = true;
};

const editParentalLinkDialog = ref(false);
</script>

<template>
  <AppDefaultLayout>
    <div class="default-spacing py-4 sm:py-10">
      <div v-if="isFetching">Loading...</div>
      <div v-else class="space-y-6">
        <div class="space-y-2">
          <AppHeading
            title="Individuals"
            :actions="[{ name: 'Add', action: addIndividual, primary: true }]"
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
                <td class="simple-table-actions">
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="editIndividual(individual)"
                  >
                    Edit
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div class="space-y-2">
          <AppHeading
            title="Couples"
            :actions="[{ name: 'Add', action: addCouple, primary: true }]"
          />
          <AppSimpleTable v-if="couples.length">
            <thead>
              <tr>
                <th>Id</th>
                <th>Partner 1</th>
                <th>Partner 2</th>
                <th>Marriage status</th>
                <th class="simple-table-actions"></th>
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
                <td class="simple-table-actions">
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="editCouple(couple)"
                  >
                    Edit
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div class="space-y-2">
          <AppHeading
            title="Parental links"
            :actions="[{ name: 'Add', action: addParentalLink, primary: true }]"
          />
          <AppSimpleTable v-if="parentalLinks.length">
            <thead>
              <tr>
                <th>Id</th>
                <th>Child</th>
                <th>Parents</th>
                <th>Parental type</th>
                <th class="simple-table-actions"></th>
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
                <td class="simple-table-actions">
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="editParentalLink(parentalLink)"
                  >
                    Edit
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>
      </div>
    </div>
  </AppDefaultLayout>
  <EditIndividualDialog
    v-model:show="editIndividualDialog"
    :item="individualToEdit"
    @saved="fetch"
    @deleted="fetch"
  />
  <EditCoupleDialog
    v-model:show="editCoupleDialog"
    :item="coupleToEdit"
    @saved="fetch"
    @deleted="fetch"
  />
  <EditParentalLinkDialog
    v-model:show="editParentalLinkDialog"
    :item="parentalLinkToEdit"
    @saved="fetch"
    @deleted="fetch"
  />
</template>
