<script setup lang="ts">
import {
  AppButton,
  AppDialog,
  AppEmptyStateButton,
  AppHeading,
} from "@/components/Base";
import AppSteps from "@/components/Base/Display/AppSteps.vue";
import type { ParentalLink, Couple, Individual } from "@/store/contacts";
import type { StepItem } from "@/types";
import { computed, ref, toRefs, type PropType } from "vue";
import EditIndividualDialog from "../Individuals/EditIndividualDialog.vue";
import { UserPlusIcon, SquaresPlusIcon } from "@heroicons/vue/24/outline";
import { ComponentColor, LocalStorageKeys } from "@/enums";
import EditCoupleDialog from "../Couples/EditCoupleDialog.vue";
import EditParentalLinkDialog from "./EditParentalLinkDialog.vue";
import _ from "lodash";
import IndividualPreview from "../Individuals/IndividualPreview.vue";
import { StorageSerializers, useStorage } from "@vueuse/core";
import type * as yup from "yup";
import type { coupleSchema } from "@/schemas";

const props = defineProps({
  show: Boolean,
  child: { type: Object as PropType<Individual>, required: true },
});

const emit = defineEmits<{
  (event: "update:show", value: boolean): void;
  (event: "added", value: ParentalLink): void;
}>();

const { show } = toRefs(props);

const dialog = computed({
  get() {
    return show.value;
  },
  set(value) {
    emit("update:show", value);
  },
});

const isLoading = ref(false);

const currentStep = ref(0);

const steps: StepItem[] = [
  {
    name: "1st parent",
    isCompleted: false,
  },
  {
    name: "2nd parent",
    isCompleted: false,
  },

  {
    name: "Relationship",
    isCompleted: false,
  },
  { name: "Review", isCompleted: false },
];

const parent1 = ref<Individual>();
const parent2 = ref<Individual>();
const parentToEdit = ref<Individual>();
const couple = ref<Couple>();
const parentalLink = ref<ParentalLink>();

const editIndividualDialog = ref(false);
const editCoupleDialog = ref(false);
const editParentalLinkDialog = ref(false);

const isLastStep = computed(() => {
  return currentStep.value === steps.length - 1;
});

const isFirstStep = computed(() => {
  return currentStep.value === 0;
});

const canNext = computed(() => {
  if (currentStep.value === 0) return !!parent1.value;
  if (currentStep.value === 1) return !!parent2.value;
  if (currentStep.value === 2) return !!parentalLink.value;
  if (currentStep.value === 3) return true;

  return false;
});
const canPrevious = computed(() => {
  return !isFirstStep.value;
});

const onPrevious = () => {
  if (canPrevious.value) currentStep.value--;
};

const token = useStorage(LocalStorageKeys.ACCESS_TOKEN, null, undefined, {
  serializer: StorageSerializers.string,
});

const onNext = async () => {
  if (!isLastStep.value) {
    if (currentStep.value === 1 && !couple.value) {
      if (!(parent1.value && parent2.value)) throw new Error("Unknown error.");

      try {
        isLoading.value = true;

        const newCouple: yup.InferType<typeof coupleSchema> = {
          id: undefined,
          partner1: parent1.value,
          partner2: parent2.value,
          stillMarried: true,
        };

        const response = await fetch(`http://localhost:3000/v1/couples`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCouple),
        });

        if (!response.ok) {
          throw new Error((await response.json()).message);
        } else {
          couple.value = (await response.json()) as Couple;
        }
      } catch (error) {
        alert(error);
      } finally {
        isLoading.value = false;
      }
    }

    currentStep.value++;
  } else if (parentalLink.value) {
    dialog.value = false;
    emit("added", parentalLink.value);
  }
};

const onCancel = () => {
  dialog.value = false;
};

const onSavedIndividual = (individual: Individual) => {
  if (currentStep.value === 0) {
    parent1.value = individual;
  } else if (currentStep.value === 1) {
    parent2.value = individual;
  }
};

const onSavedCouple = (savedCouple: Couple) => {
  couple.value = savedCouple;
};
const onSavedParentalLink = (savedParentalLink: ParentalLink) => {
  parentalLink.value = savedParentalLink;
};

const editParent1 = () => {
  parentToEdit.value = parent1.value;
  editIndividualDialog.value = true;
};

const editParent2 = () => {
  parentToEdit.value = parent2.value;
  editIndividualDialog.value = true;
};

const editCouple = () => {
  editCoupleDialog.value = true;
};

const editParentalLink = () => {
  editParentalLinkDialog.value = true;
};
</script>

<template>
  <AppDialog v-model="dialog" :loading="isLoading">
    <div class="space-y-4">
      <AppSteps :steps="steps" :current-step="currentStep" />

      <template v-if="currentStep === 0">
        <div v-if="parent1">
          <IndividualPreview :individual="parent1" :edit="editParent1" />
        </div>
        <AppEmptyStateButton
          v-else
          :icon="UserPlusIcon"
          title="Create new individual"
          @click="editParent1"
        />
      </template>

      <template v-if="currentStep === 1">
        <div v-if="parent2">
          <IndividualPreview :individual="parent2" :edit="editParent2" />
        </div>
        <AppEmptyStateButton
          v-else
          :icon="UserPlusIcon"
          title="Create new individual"
          @click="editParent2"
        />
      </template>

      <template v-if="currentStep === 2">
        <div v-if="parentalLink" class="space-y-4">
          <AppHeading
            :actions="[
              { name: 'Edit', action: editParentalLink, primary: true },
            ]"
          />
          <div>
            <p>
              Parent 1:
              <strong>
                {{ parentalLink.parentCouple.partner1.fullName }}
              </strong>
            </p>
            <p>
              Parent 2:
              <strong>
                {{ parentalLink.parentCouple.partner2.fullName }}
              </strong>
            </p>
            <p>
              Child:
              <strong>
                {{ parentalLink.child.fullName }}
              </strong>
            </p>
            <p>
              Parental type:
              <strong>
                {{ parentalLink.type.type }}
              </strong>
            </p>
          </div>
        </div>
        <AppEmptyStateButton
          v-else
          :icon="SquaresPlusIcon"
          :title="`Create new parental relationship for parents ${parent1?.fullName} - ${parent2?.fullName} and child ${child.fullName}`"
          @click="editParentalLink"
        />
      </template>

      <template v-if="currentStep === 3">
        <IndividualPreview
          v-if="parent1"
          :individual="parent1"
          :edit="editParent1"
        />
        <IndividualPreview
          v-if="parent2"
          :individual="parent2"
          :edit="editParent2"
        />

        <div v-if="couple" class="flex justify-between">
          <p>
            Couple status: {{ couple.stillMarried ? "Married" : "Divorced" }}
          </p>
          <AppButton @click="editCouple" :color="ComponentColor.PRIMARY">
            Edit
          </AppButton>
        </div>

        <div v-if="parentalLink" class="flex justify-between">
          <p>Parental type: {{ parentalLink.type.type }}</p>
          <AppButton @click="editParentalLink" :color="ComponentColor.PRIMARY">
            Edit
          </AppButton>
        </div>
      </template>

      <div class="flex flex-wrap justify-end gap-2">
        <AppButton
          :color="ComponentColor.PRIMARY"
          :disabled="!canPrevious"
          @click="onPrevious"
        >
          Previous
        </AppButton>
        <AppButton
          :color="ComponentColor.PRIMARY"
          :disabled="!canNext"
          @click="onNext"
        >
          {{ isLastStep ? "Done" : "Next" }}
        </AppButton>
        <AppButton :color="ComponentColor.SECONDARY" @click="onCancel">
          Cancel
        </AppButton>
      </div>

      <EditIndividualDialog
        v-model:show="editIndividualDialog"
        :item="parentToEdit"
        @saved="onSavedIndividual"
      />

      <EditCoupleDialog
        v-model:show="editCoupleDialog"
        :item="couple"
        :from-individuals="_.compact([parent1, parent2])"
        @saved="onSavedCouple"
      />
      <EditParentalLinkDialog
        v-model:show="editParentalLinkDialog"
        :item="parentalLink"
        :from-child="child"
        :from-couple="couple"
        @saved="onSavedParentalLink"
      />
    </div>
  </AppDialog>
</template>
