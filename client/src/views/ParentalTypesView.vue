<script setup lang="ts">
import AppButton from "@/components/Base/AppButton.vue";
import AppDefaultLayout from "@/components/Layouts/AppDefaultLayout.vue";
import AppHeading from "@/components/Base/AppHeading.vue";
import AppDialog from "@/components/Base/AppDialog.vue";
import AppSimpleTable from "@/components/Base/AppSimpleTable.vue";
import { ComponentColor, RouteNames } from "@/enums";
import { computed, onBeforeMount, ref } from "vue";
import { type ParentalType, useContactsStore } from "@/store/contacts";
import ContactsEditParentTypeForm from "@/components/Contacts/ParentalTypes/EditParentalTypeForm.vue";

const contactsStore = useContactsStore();

const parentTypes = computed(() => {
  return contactsStore.parentalTypes;
});

const fetch = async () => {
  await contactsStore.findAllParentTypes();
};

onBeforeMount(async () => {
  await fetch();
});

const closeDialog = () => {
  editDialog.value = false;
  return fetch();
};

const editDialog = ref(false);

const parentTypeToEdit = ref<ParentalType>();

const formKey = ref(0);

const addItem = () => {
  parentTypeToEdit.value = undefined;
  formKey.value++;
  editDialog.value = true;
};

const editItem = (item: ParentalType) => {
  parentTypeToEdit.value = item;
  formKey.value++;
  editDialog.value = true;
};
</script>

<template>
  <AppDefaultLayout>
    <div class="default-spacing space-y-4 py-4 sm:py-10">
      <AppHeading
        :breadcrumbs="[
          { name: 'Contacts', to: { name: RouteNames.CONTACTS } },
          {
            name: 'Parent types',
            to: { name: RouteNames.CONTACTS_PARENT_TYPES },
          },
        ]"
        title="Manage parent types"
        :actions="[{ name: 'Add', action: addItem, primary: true }]"
      ></AppHeading>
      <AppSimpleTable>
        <thead>
          <tr>
            <th>Types</th>
            <th class="simple-table-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="parentType in parentTypes" :key="parentType.id">
            <td>{{ parentType.type }}</td>
            <td class="simple-table-actions">
              <AppButton
                :padding="false"
                text
                :color="ComponentColor.PRIMARY"
                @click="editItem(parentType)"
              >
                Edit
              </AppButton>
            </td>
          </tr>
        </tbody>
      </AppSimpleTable>
      <!-- <table class="simple-table">
      </table> -->
    </div>
    <AppDialog v-model="editDialog">
      <ContactsEditParentTypeForm
        :key="formKey"
        :item="parentTypeToEdit"
        @saved="closeDialog"
        @deleted="closeDialog"
        @cancel="closeDialog"
      />
    </AppDialog>
  </AppDefaultLayout>
</template>
