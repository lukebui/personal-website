<script setup lang="ts">
import {
  AppDialog,
  AppHeading,
  AppCard,
  AppSimpleTable,
  AppButton,
} from "@/components/Base";
import {
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
import SelectCoupleAddTypeDialog from "../Couples/SelectCoupleAddTypeDialog.vue";
import AddCoupleFromNewIndividualDialog from "../Couples/AddCoupleFromNewIndividualDialog.vue";
import _ from "lodash";
import SelectParentalLinkAddTypeDialog from "../ParentalLinks/SelectParentalLinkAddTypeDialog.vue";
import EditParentalLinkDialog from "../ParentalLinks/EditParentalLinkDialog.vue";
import AddParentalLinkFromNewIndividualsDialog from "../ParentalLinks/AddParentalLinkFromNewIndividualsDialog.vue";

const props = defineProps({
  show: Boolean,
  item: Object as PropType<Individual>,
});

const emit = defineEmits(["update:show", "changed"]);

const { show, item } = toRefs(props);

const contactsStore = useContactsStore();

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

const selectedIndividual = computed(() =>
  contactsStore.individuals.find((tempIndividual) =>
    item?.value ? tempIndividual.id === item.value.id : false
  )
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
  contactsStore.parentalLinks
    .filter(
      (parentalLink) => parentalLink.child.id === selectedIndividual.value?.id
    )
    .map((parentalLink) => {
      return {
        parents: [
          parentalLink.parentCouple.partner1,
          parentalLink.parentCouple.partner2,
        ],
        parentalType: parentalLink.type,
        parentalLink,
      };
    })
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
        .map((parent) => parent.parentalLink.parentCouple.id)
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
  SELECT_COUPLE_ADD_TYPE_DIALOG = "selectCoupleAndTypeDialog",
  SELECT_PARENTAL_LINK_ADD_TYPE_DIALOG = "selectParentalLinkAddTypeDialog",
  ADD_COUPLE_FROM_NEW_INDIVIDUAL_DIALOG = "addCoupleFromNewIndividualDialog",
  ADD_PARENTAL_LINK_FROM_NEW_INDIVIDUALS_DIALOG = "addParentalLinkFromNewIndividualsDialog",
}

type SubDialogStatus = Record<SubDialogs, boolean>;

const subDialogStatus = ref<SubDialogStatus>({
  [SubDialogs.EDIT_INDIVIDUAL_DIALOG]: false,
  [SubDialogs.EDIT_COUPLE_DIALOG]: false,
  [SubDialogs.EDIT_PARENTAL_LINK]: false,
  [SubDialogs.SELECT_COUPLE_ADD_TYPE_DIALOG]: false,
  [SubDialogs.SELECT_PARENTAL_LINK_ADD_TYPE_DIALOG]: false,
  [SubDialogs.ADD_COUPLE_FROM_NEW_INDIVIDUAL_DIALOG]: false,
  [SubDialogs.ADD_PARENTAL_LINK_FROM_NEW_INDIVIDUALS_DIALOG]: false,
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
  return fetch();
};

const onDeleted = () => {
  emit("changed");
  dialog.value = false;
};

const onToCreateNewSpouse = () => {
  subDialogStatus.value[SubDialogs.SELECT_COUPLE_ADD_TYPE_DIALOG] = false;
  setTimeout(() => {
    subDialogStatus.value[SubDialogs.ADD_COUPLE_FROM_NEW_INDIVIDUAL_DIALOG] =
      true;
  }, 300);
};
const onToLinkExistingSpouse = () => {
  subDialogStatus.value[SubDialogs.SELECT_COUPLE_ADD_TYPE_DIALOG] = false;
  setTimeout(() => {
    subDialogStatus.value[SubDialogs.EDIT_COUPLE_DIALOG] = true;
  }, 300);
};

const onToCreateNewParents = () => {
  subDialogStatus.value[SubDialogs.SELECT_PARENTAL_LINK_ADD_TYPE_DIALOG] =
    false;
  setTimeout(() => {
    subDialogStatus.value[
      SubDialogs.ADD_PARENTAL_LINK_FROM_NEW_INDIVIDUALS_DIALOG
    ] = true;
  }, 300);
};
const onToLinkExistingParents = () => {
  subDialogStatus.value[SubDialogs.SELECT_PARENTAL_LINK_ADD_TYPE_DIALOG] =
    false;
  setTimeout(() => {
    subDialogStatus.value[SubDialogs.EDIT_PARENTAL_LINK] = true;
  }, 300);
};
</script>

<template>
  <AppDialog v-model="dialog" :size="ComponentSize.LARGE">
    <AppHeading
      :title="selectedIndividual?.fullName"
      :actions="
        selectedIndividual
          ? [
              {
                name: 'Edit',
                action: () =>
                  (subDialogStatus[SubDialogs.EDIT_INDIVIDUAL_DIALOG] = true),
                primary: true,
              },
            ]
          : undefined
      "
      :close-action="() => (dialog = false)"
    />

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
                <th class="simple-table-actions">
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="
                      subDialogStatus[
                        SubDialogs.SELECT_PARENTAL_LINK_ADD_TYPE_DIALOG
                      ] = true
                    "
                  >
                    Add Parents
                  </AppButton>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="parentCouple in individualParents"
                :key="parentCouple.parentalLink.id"
              >
                <td>
                  {{
                    parentCouple.parents
                      .map((parent) => parent.fullName)
                      .join(", ")
                  }}
                </td>
                <td>
                  {{ parentCouple.parentalType.type }}
                </td>
                <td class="simple-table-actions">
                  <div class="inline-flex flex-wrap gap-2 sm:gap-4">
                    <AppButton text :color="ComponentColor.PRIMARY">
                      Add sibling
                    </AppButton>
                    <AppButton text :color="ComponentColor.PRIMARY">
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
                <th class="simple-table-actions">
                  <AppButton text :color="ComponentColor.PRIMARY">
                    Add sibling
                  </AppButton>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sibling in individualSiblings"
                :key="sibling.__parentalLink.id"
              >
                <td>
                  {{ sibling.individual.fullName }}
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
                    <AppButton text :color="ComponentColor.PRIMARY">
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
                <th>Spouse</th>
                <th>Status</th>
                <th class="simple-table-actions">
                  <AppButton
                    text
                    :color="ComponentColor.PRIMARY"
                    @click="
                      subDialogStatus[
                        SubDialogs.SELECT_COUPLE_ADD_TYPE_DIALOG
                      ] = true
                    "
                  >
                    Add spouse
                  </AppButton>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="partner in individualPartners"
                :key="partner.couple.id"
              >
                <td>
                  {{ partner.partner.fullName }}
                </td>
                <td>
                  {{ partner.stillMarried ? "Married" : "Divorced" }}
                </td>
                <td class="simple-table-actions">
                  <div
                    class="inline-flex flex-wrap justify-between gap-2 sm:gap-4"
                  >
                    <AppButton text :color="ComponentColor.PRIMARY">
                      Add child
                    </AppButton>
                    <AppButton text :color="ComponentColor.PRIMARY">
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
                <th class="simple-table-actions">
                  <AppButton text :color="ComponentColor.PRIMARY">
                    Add child
                  </AppButton>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="child in individualChildren"
                :key="child.parentalLink.id"
              >
                <td>
                  {{ child.child.fullName }}
                </td>
                <td>
                  {{ child.spouse.fullName }}
                </td>
                <td>
                  {{ child.parentalType.type }}
                </td>
                <td class="simple-table-actions">
                  <div class="inline-flex flex-wrap gap-2">
                    <AppButton text :color="ComponentColor.PRIMARY">
                      Edit
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
          :from-individuals="[selectedIndividual]"
          @saved="fetch"
        />
        <EditParentalLinkDialog
          v-model:show="subDialogStatus[SubDialogs.EDIT_PARENTAL_LINK]"
          :from-child="selectedIndividual"
          @saved="fetch"
        />
        <SelectCoupleAddTypeDialog
          v-model:show="
            subDialogStatus[SubDialogs.SELECT_COUPLE_ADD_TYPE_DIALOG]
          "
          @create="onToCreateNewSpouse"
          @link="onToLinkExistingSpouse"
        />
        <SelectParentalLinkAddTypeDialog
          v-model:show="
            subDialogStatus[SubDialogs.SELECT_PARENTAL_LINK_ADD_TYPE_DIALOG]
          "
          @create="onToCreateNewParents"
          @link="onToLinkExistingParents"
        />
        <AddCoupleFromNewIndividualDialog
          v-model:show="
            subDialogStatus[SubDialogs.ADD_COUPLE_FROM_NEW_INDIVIDUAL_DIALOG]
          "
          :from-individual="selectedIndividual"
          @added="fetch"
        />
        <AddParentalLinkFromNewIndividualsDialog
          v-model:show="
            subDialogStatus[
              SubDialogs.ADD_PARENTAL_LINK_FROM_NEW_INDIVIDUALS_DIALOG
            ]
          "
          :child="selectedIndividual"
          @added="fetch"
        />
      </div>
    </template>
  </AppDialog>
</template>
