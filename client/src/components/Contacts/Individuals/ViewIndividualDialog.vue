<script setup lang="ts">
import { useContactsStore, type Individual } from "@/store/contacts";
import { computed, ref, toRefs, type PropType } from "vue";
import AppDialog from "../../Base/AppDialog.vue";
import EditIndividualDialog from "./EditIndividualDialog.vue";
import { ComponentColor, ComponentSize } from "@/enums";
import moment from "moment";
import AppHeading from "../../Base/AppHeading.vue";
import AppCard from "@/components/Base/AppCard.vue";
import AppSimpleTable from "@/components/Base/AppSimpleTable.vue";
import AppButton from "@/components/Base/AppButton.vue";

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

const individual = computed(() =>
  contactsStore.individuals.find((tempIndividual) =>
    item?.value ? tempIndividual.id === item.value.id : false
  )
);

const partners = computed(() =>
  contactsStore.couples
    .filter(
      (couple) =>
        couple.partner1.id === individual.value?.id ||
        couple.partner2.id === individual.value?.id
    )
    .map((couple) => {
      return {
        partner:
          couple.partner1.id === individual.value?.id
            ? couple.partner2
            : couple.partner1,
        stillMarried: couple.stillMarried,
        couple,
      };
    })
);

const children = computed(() =>
  contactsStore.parentalLinks
    .filter(
      (parentalLink) =>
        parentalLink.parentCouple.partner1.id === individual.value?.id ||
        parentalLink.parentCouple.partner2.id === individual.value?.id
    )
    .map((parentalLink) => {
      return {
        child: parentalLink.child,
        spouse:
          parentalLink.parentCouple.partner1.id === individual.value?.id
            ? parentalLink.parentCouple.partner2
            : parentalLink.parentCouple.partner1,
        parentalType: parentalLink.type,
        parentalLink,
      };
    })
);

const parents = computed(() =>
  contactsStore.parentalLinks
    .filter((parentalLink) => parentalLink.child.id === individual.value?.id)
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

const siblings = computed(() =>
  contactsStore.parentalLinks
    .filter(
      (siblingParentalLink) =>
        parents.value
          .map((parent) => parent.parentalLink.parentCouple.id)
          .includes(siblingParentalLink.parentCouple.id) &&
        siblingParentalLink.child.id !== individual.value?.id
    )
    .map((siblingParentalLink) => {
      return {
        sibling: siblingParentalLink.child,
        parents: [
          siblingParentalLink.parentCouple.partner1,
          siblingParentalLink.parentCouple.partner2,
        ],
        parentalType: siblingParentalLink.type,
        parentalLink: siblingParentalLink,
      };
    })
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
  <AppDialog v-model="dialog" :size="ComponentSize.LARGE">
    <a href="#" class="sr-only"></a>
    <AppHeading
      :title="individual?.fullName"
      :actions="
        individual
          ? [
              {
                name: 'Edit',
                action: () => (editDialog = true),
                primary: true,
              },
            ]
          : undefined
      "
      :close-action="() => (dialog = false)"
    />

    <template v-if="isFetching"> Loading... </template>

    <template v-else>
      <div v-if="individual" class="mt-4 space-y-4 sm:mt-0">
        <div>
          <p>Nickname: {{ individual.alias }}</p>
          <p>Gender: {{ individual.gender }}</p>
          <p>
            Date of birth:
            <span v-if="individual.dateOfBirth">
              {{ moment(individual.dateOfBirth).format("DD/MM/YYYY") }}
            </span>
          </p>
          <p v-if="individual.dateOfDeath">
            Date of death:
            {{ moment(individual.dateOfDeath).format("DD/MM/YYYY") }}
          </p>
          <p v-else-if="individual.hasDied">Has died</p>
          <p>Note:</p>
          <AppCard well v-if="individual.note">
            <p class="whitespace-pre-wrap">
              {{ individual.note }}
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
                  <AppButton text :color="ComponentColor.PRIMARY">
                    Add Parents
                  </AppButton>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="parentCouple in parents"
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
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sibling in siblings" :key="sibling.parentalLink.id">
                <td>
                  {{ sibling.sibling.fullName }}
                </td>
                <td>
                  {{
                    sibling.parents.map((parent) => parent.fullName).join(", ")
                  }}
                </td>
                <td>
                  {{ sibling.parentalType.type }}
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
                  <AppButton text :color="ComponentColor.PRIMARY">
                    Add spouse
                  </AppButton>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="partner in partners" :key="partner.couple.id">
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
                <th class="simple-table-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="child in children" :key="child.parentalLink.id">
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
      </div>
    </template>

    <EditIndividualDialog
      v-model:show="editDialog"
      :item="item"
      @saved="fetch"
      @deleted="dialog = false"
    ></EditIndividualDialog>
  </AppDialog>
</template>
