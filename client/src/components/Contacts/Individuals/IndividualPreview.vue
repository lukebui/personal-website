<script setup lang="ts">
import type { Individual } from "@/store/contacts";
import type { PropType } from "vue";
import moment from "moment";
import { AppCard, AppHeading } from "@/components/Base";

defineProps({
  individual: { type: Object as PropType<Individual>, required: true },
  edit: Function as PropType<() => void>,
});
</script>

<template>
  <div>
    <AppHeading
      :title="individual.fullName"
      :actions="
        edit
          ? [
              {
                name: 'Edit',
                action: edit,
                primary: true,
              },
            ]
          : []
      "
    />

    <div class="mt-4 space-y-4 sm:mt-0">
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
    </div>
  </div>
</template>
