<script setup lang="ts">
import {
  AppDialog,
  AppHeading,
  AppCard,
  AppSimpleTable,
  AppButton,
  AppMenu,
} from "@/components/Base";
import {
  type Couple,
  useContactsStore,
  type Individual,
  type ParentalLink,
  type ParentalType,
} from "@/store/contacts";
import { computed, ref, toRefs, watch, type PropType } from "vue";
import EditIndividualDialog from "./EditIndividualDialog.vue";
import { ComponentColor, ComponentSize } from "@/enums";
import moment from "moment";
import EditCoupleDialog from "../Couples/EditCoupleDialog.vue";
import _ from "lodash";
import EditParentalLinkDialog from "../ParentalLinks/EditParentalLinkDialog.vue";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Individual>,
});

const emit = defineEmits(["update:show", "changed"]);

const { show, item } = toRefs(props);

const contactsStore = useContactsStore();

const individuals = computed(() => {
  return contactsStore.individuals;
});

const isFetching = ref(false);

const fetchData = async () => {
  try {
    isFetching.value = true;

    await contactsStore.fetch();
  } catch (error) {
    alert(error);
  } finally {
    isFetching.value = false;
  }
};

const selectedIndividual = ref<Individual>();

watch(
  () => item?.value,
  async (newItem) => {
    if (newItem) {
      await fetchData();

      const matchedIndividual = individuals.value.find(
        (tempIndividual) => tempIndividual.id === item?.value?.id
      );

      if (matchedIndividual) {
        selectedIndividual.value = matchedIndividual;
      } else {
        emit("update:show", false);
      }
    } else {
      emit("update:show", false);
    }
  }
);

const individualPartners = computed(() =>
  contactsStore.couples
    .filter(
      (couple) =>
        couple.partner1.id === selectedIndividual.value?.id ||
        couple.partner2.id === selectedIndividual.value?.id
    )
    .map((couple) => {
      return {
        partner:
          couple.partner1.id === selectedIndividual.value?.id
            ? couple.partner2
            : couple.partner1,
        stillMarried: couple.stillMarried,
        couple,
      };
    })
);

const individualChildren = computed(() =>
  contactsStore.parentalLinks
    .filter(
      (parentalLink) =>
        parentalLink.parentCouple.partner1.id ===
          selectedIndividual.value?.id ||
        parentalLink.parentCouple.partner2.id === selectedIndividual.value?.id
    )
    .map((parentalLink) => {
      return {
        child: parentalLink.child,
        spouse:
          parentalLink.parentCouple.partner1.id === selectedIndividual.value?.id
            ? parentalLink.parentCouple.partner2
            : parentalLink.parentCouple.partner1,
        parentalType: parentalLink.type,
        parentalLink,
      };
    })
);

const individualParents = computed(() =>
  contactsStore.parentalLinks.filter(
    (parentalLink) => parentalLink.child.id === selectedIndividual.value?.id
  )
);

const individualSiblings = computed(() => {
  type Sibling = {
    individual: Individual;
    olderSibling: Individual | null;
    parents: Individual[];
    parentalType: ParentalType;
    __parentalLink: ParentalLink;
  };

  let foundChildren = contactsStore.parentalLinks
    .filter((siblingParentalLink) =>
      individualParents.value
        .map((parent) => parent.parentCouple.id)
        .includes(siblingParentalLink.parentCouple.id)
    )
    .map((siblingParentalLink) => {
      return {
        individual: siblingParentalLink.child,
        olderSibling: siblingParentalLink.olderSibling?.child || null,
        parents: [
          siblingParentalLink.parentCouple.partner1,
          siblingParentalLink.parentCouple.partner2,
        ],
        parentalType: siblingParentalLink.type,
        __parentalLink: siblingParentalLink,
      } as Sibling;
    });

  const getYoungerSiblings = (olderSibling: Sibling): Sibling[] => {
    const youngerSibling = foundChildren.find((sibling) => {
      return olderSibling?.individual.id === sibling.olderSibling?.id;
    });

    if (youngerSibling) {
      return [youngerSibling].concat(getYoungerSiblings(youngerSibling));
    } else {
      return [];
    }
  };

  const siblingChain = (() => {
    const oldestSibling = foundChildren.find(
      (child) => child.__parentalLink.olderSibling === null
    );

    return oldestSibling
      ? [oldestSibling].concat(getYoungerSiblings(oldestSibling))
      : [];
  })();

  const individualSiblingIndex = siblingChain.findIndex(
    (child) => child.individual.id === selectedIndividual.value?.id
  );

  return foundChildren
    .filter((child) => child.individual.id !== selectedIndividual.value?.id)
    .sort((a, b) => {
      const aIndex = siblingChain.findIndex(
        (child) => child.individual.id === a.individual.id
      );
      const bIndex = siblingChain.findIndex(
        (child) => child.individual.id === b.individual.id
      );

      return aIndex > bIndex ? 1 : aIndex < bIndex ? -1 : 0;
    })
    .map((child) => {
      const childIndex = siblingChain.findIndex(
        (targetChild) => child.individual.id === targetChild.individual.id
      );
      return { ...child, older: childIndex < individualSiblingIndex };
    });
});

const dialog = computed({
  get() {
    return show.value;
  },
  set(value) {
    emit("update:show", value);
  },
});

enum SubDialogs {
  EDIT_INDIVIDUAL_DIALOG = "editIndividualDialog",
  EDIT_COUPLE_DIALOG = "editCoupleDialog",
  EDIT_PARENTAL_LINK = "editParentalLink",
}

type SubDialogStatus = Record<SubDialogs, boolean>;

const subDialogStatus = ref<SubDialogStatus>({
  [SubDialogs.EDIT_INDIVIDUAL_DIALOG]: false,
  [SubDialogs.EDIT_COUPLE_DIALOG]: false,
  [SubDialogs.EDIT_PARENTAL_LINK]: false,
});

watch(dialog, (newDialog) => {
  if (!newDialog) {
    for (const subDialog of _.values(SubDialogs)) {
      subDialogStatus.value[subDialog] = false;
    }
  }
});

const onSaved = () => {
  emit("changed");
  return fetchData();
};

const onDeleted = () => {
  emit("changed");
  dialog.value = false;
};

const parentalLinkToEdit = ref<ParentalLink>();
const coupleToEdit = ref<Couple>();
const childToAddNewParentalLink = ref<Individual>();
const parentsToAddNewParentalLink = ref<Couple>();

const onToAddParents = () => {
  parentalLinkToEdit.value = undefined;
  parentsToAddNewParentalLink.value = undefined;
  childToAddNewParentalLink.value = selectedIndividual.value;
  subDialogStatus.value[SubDialogs.EDIT_PARENTAL_LINK] = true;
};

const onToAddSpouse = () => {
  coupleToEdit.value = undefined;
  subDialogStatus.value[SubDialogs.EDIT_COUPLE_DIALOG] = true;
};

const onToAddSibling = (parents: Couple) => {
  parentalLinkToEdit.value = undefined;
  parentsToAddNewParentalLink.value = parents;
  childToAddNewParentalLink.value = undefined;
  subDialogStatus.value[SubDialogs.EDIT_PARENTAL_LINK] = true;
};

const onToAddChild = (parents: Couple) => {
  parentalLinkToEdit.value = undefined;
  parentsToAddNewParentalLink.value = parents;
  childToAddNewParentalLink.value = undefined;
  subDialogStatus.value[SubDialogs.EDIT_PARENTAL_LINK] = true;
};

const onViewIndividual = (individual: Individual) => {
  selectedIndividual.value = individual;
};

const onEditParents = (parentalLink: ParentalLink) => {
  parentalLinkToEdit.value = parentalLink;
  parentsToAddNewParentalLink.value = undefined;
  childToAddNewParentalLink.value = selectedIndividual.value;
  subDialogStatus.value[SubDialogs.EDIT_PARENTAL_LINK] = true;
};

const onEditCouple = (couple: Couple) => {
  coupleToEdit.value = couple;
  subDialogStatus.value[SubDialogs.EDIT_COUPLE_DIALOG] = true;
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.LARGE">
    <AppHeading
      :title="selectedIndividual?.fullName"
      :close-action="() => (dialog = false)"
    >
      <template #actions>
        <div class="flex gap-3">
          <AppMenu
            :actions="[
              {
                text: 'Add parents',
                action: onToAddParents,
              },
              {
                text: 'Add spouse',
                action: onToAddSpouse,
              },
            ]"
          >
            <template #button>
              <AppButton :color="ComponentColor.SECONDARY"> Options </AppButton>
            </template>
          </AppMenu>
          <AppButton
            :color="ComponentColor.PRIMARY"
            @click="subDialogStatus[SubDialogs.EDIT_INDIVIDUAL_DIALOG] = true"
          >
            Edit
          </AppButton>
        </div>
      </template>
    </AppHeading>

    <template v-if="isFetching"> Loading... </template>

    <template v-else>
      <div v-if="selectedIndividual" class="mt-4 space-y-4 sm:mt-0">
        <div>
          <p>Nickname: {{ selectedIndividual.alias }}</p>
          <p>Gender: {{ selectedIndividual.gender }}</p>
          <p>
            Date of birth:
            <span v-if="selectedIndividual.dateOfBirth">
              {{ moment(selectedIndividual.dateOfBirth).format("DD/MM/YYYY") }}
            </span>
          </p>
          <p v-if="selectedIndividual.dateOfDeath">
            Date of death:
            {{ moment(selectedIndividual.dateOfDeath).format("DD/MM/YYYY") }}
          </p>
          <p v-else-if="selectedIndividual.hasDied">Has died</p>
          <p>Note:</p>
          <AppCard well v-if="selectedIndividual.note">
            <p class="whitespace-pre-wrap">
              {{ selectedIndividual.note }}
            </p>
          </AppCard>
        </div>

        <div>
          <AppSimpleTable>
            <thead>
              <tr>
                <th>Parents</th>
                <th>Type</th>
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="parentalLink in individualParents"
                :key="parentalLink.id"
              >
                <td>
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="
                      onViewIndividual(parentalLink.parentCouple.partner1)
                    "
                  >
                    {{ parentalLink.parentCouple.partner1.fullName }}
                  </AppButton>
                  <span>, </span>
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="
                      onViewIndividual(parentalLink.parentCouple.partner2)
                    "
                  >
                    {{ parentalLink.parentCouple.partner2.fullName }}
                  </AppButton>
                </td>
                <td>
                  {{ parentalLink.type.type }}
                </td>
                <td class="simple-table-actions">
                  <div class="inline-flex flex-wrap gap-2 sm:gap-4">
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="onToAddSibling(parentalLink.parentCouple)"
                    >
                      Add sibling
                    </AppButton>
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="onEditParents(parentalLink)"
                    >
                      Edit
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div>
          <AppSimpleTable>
            <thead>
              <tr>
                <th>Sibling</th>
                <th>Parents</th>
                <th>Parental type</th>
                <th>Older / Younger</th>
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sibling in individualSiblings"
                :key="sibling.__parentalLink.id"
              >
                <td>
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="onViewIndividual(sibling.individual)"
                  >
                    {{ sibling.individual.fullName }}
                  </AppButton>
                </td>
                <td>
                  {{
                    sibling.parents.map((parent) => parent.fullName).join(", ")
                  }}
                </td>
                <td>
                  {{ sibling.parentalType.type }}
                </td>
                <td>
                  {{ sibling.older ? "Older" : "Younger" }}
                </td>
                <td class="simple-table-actions">
                  <div class="inline-flex flex-wrap gap-2 sm:gap-4">
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="onViewIndividual(sibling.individual)"
                    >
                      View
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div>
          <AppSimpleTable>
            <thead>
              <tr>
                <th>Spouse</th>
                <th>Status</th>
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="partner in individualPartners"
                :key="partner.couple.id"
              >
                <td>
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="onViewIndividual(partner.partner)"
                  >
                    {{ partner.partner.fullName }}
                  </AppButton>
                </td>
                <td>
                  {{ partner.stillMarried ? "Married" : "Divorced" }}
                </td>
                <td class="simple-table-actions">
                  <div
                    class="inline-flex flex-wrap justify-between gap-2 sm:gap-4"
                  >
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="onToAddChild(partner.couple)"
                    >
                      Add child
                    </AppButton>
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="onEditCouple(partner.couple)"
                    >
                      Edit
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>

        <div>
          <AppSimpleTable>
            <thead>
              <tr>
                <th>Child</th>
                <th>Spouse</th>
                <th>Parental type</th>
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="child in individualChildren"
                :key="child.parentalLink.id"
              >
                <td>
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="onViewIndividual(child.child)"
                  >
                    {{ child.child.fullName }}
                  </AppButton>
                </td>
                <td>
                  {{ child.spouse.fullName }}
                </td>
                <td>
                  {{ child.parentalType.type }}
                </td>
                <td class="simple-table-actions">
                  <div class="inline-flex flex-wrap gap-2">
                    <AppButton
                      text
                      :color="ComponentColor.PRIMARY"
                      @click="onViewIndividual(child.child)"
                    >
                      View
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </AppSimpleTable>
        </div>
        <EditIndividualDialog
          v-model:show="subDialogStatus[SubDialogs.EDIT_INDIVIDUAL_DIALOG]"
          :item="selectedIndividual"
          @saved="onSaved"
          @deleted="onDeleted"
        />
        <EditCoupleDialog
          v-model:show="subDialogStatus[SubDialogs.EDIT_COUPLE_DIALOG]"
          :item="coupleToEdit"
          :from-individuals="[selectedIndividual]"
          @saved="fetchData"
          @deleted="fetchData"
        />
        <EditParentalLinkDialog
          v-model:show="subDialogStatus[SubDialogs.EDIT_PARENTAL_LINK]"
          :item="parentalLinkToEdit"
          :from-child="childToAddNewParentalLink"
          :from-couple="parentsToAddNewParentalLink"
          @saved="fetchData"
          @deleted="fetchData"
        />
      </div>
    </template>
  </AppDialog>
</template>
