<script setup lang="ts">
import { useContactsStore, type Individual } from "@/store/contacts";
import { computed, ref, toRefs, type PropType } from "vue";
import AppDialog from "../Base/AppDialog.vue";
import EditIndividualDialog from "./EditIndividualDialog.vue";
import { ComponentSize } from "@/enums";
import moment from "moment";
import AppHeading from "../Base/AppHeading.vue";

const props = defineProps({
  show: Boolean,
  individual: Object as PropType<Individual>,
});

const emit = defineEmits(["update:show", "changed"]);

const { show, individual } = toRefs(props);

const contactsStore = useContactsStore();

const allIndividuals = computed(() => contactsStore.individuals);

const localIndividual = computed(() =>
  allIndividuals.value.find((tempIndividual) =>
    individual?.value ? tempIndividual.id === individual.value.id : false
  )
);

const dialog = computed({
  get() {
    return show.value;
  },
  set(value) {
    emit("update:show", value);
  },
});

const editDialog = ref(false);
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.X_LARGE">
    <a href="#" class="sr-only"></a>
    <template v-if="localIndividual">
      <div class="space-y-2">
        <AppHeading
          :title="localIndividual.fullName"
          :actions="[
            { name: 'Edit', action: () => (editDialog = true), primary: true },
          ]"
          :close-action="() => (dialog = false)"
        ></AppHeading>
        <div>
          <p v-if="localIndividual.alias">
            Nickname: {{ localIndividual.alias }}
          </p>
          <p v-if="localIndividual.gender">
            Gender: {{ localIndividual.gender }}
          </p>
          <p v-if="localIndividual.dateOfBirth">
            Date of birth:
            {{ moment(localIndividual.dateOfBirth).format("DD/MM/YYYY") }}
          </p>
          <p v-if="localIndividual.dateOfDeath">
            Date of death:
            {{ moment(localIndividual.dateOfDeath).format("DD/MM/YYYY") }}
          </p>
          <p v-else-if="localIndividual.hasDied">Has died</p>
        </div>
        <p v-if="localIndividual.note" class="truncate">
          Note: {{ localIndividual.note }}
        </p>
      </div>

      <EditIndividualDialog
        v-model:show="editDialog"
        :item="individual"
        @saved="$emit('changed')"
        @deleted="dialog = false"
      ></EditIndividualDialog>
    </template>
  </AppDialog>
</template>
