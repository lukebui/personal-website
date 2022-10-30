<script setup lang="ts">
import AppButton from "@/components/AppButton.vue";
import AppDefaultLayout from "@/components/AppDefaultLayout.vue";
import AppHeading from "@/components/AppHeading.vue";
import AppDialog from "@/components/AppDialog.vue";
import AppSimpleTable from "@/components/AppSimpleTable.vue";
import { ComponentColor, RouteNames } from "@/enums";
import { computed, onBeforeMount, ref } from "vue";
import { type ParentType, useContactsStore } from "@/store/contacts";
import ContactsEditParentTypeForm from "@/components/ContactsEditParentTypeForm.vue";

const contactsStore = useContactsStore();

const parentTypes = computed(() => {
  return contactsStore.parentTypes;
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

const parentTypeToEdit = ref<ParentType>();

const formKey = ref(0);

const addItem = () => {
  parentTypeToEdit.value = undefined;
  formKey.value++;
  editDialog.value = true;
};

const editItem = (item: ParentType) => {
  parentTypeToEdit.value = item;
  formKey.value++;
  editDialog.value = true;
};
</script>

<template>
  <AppDefaultLayout>
    <div class="mobile-fullwidth-table-spacing space-y-4">
      <AppHeading
        :breadcrumbs="[
          { name: 'Contacts', to: { name: RouteNames.CONTACTS } },
          {
            name: 'Parent types',
            to: { name: RouteNames.CONTACTS_PARENT_TYPES },
          },
        ]"
        title="Manage parent types"
        :actions="[
          { name: 'Add', action: addItem, color: ComponentColor.PRIMARY },
        ]"
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
        @cancelled="closeDialog"
      />
    </AppDialog>
  </AppDefaultLayout>
</template>
