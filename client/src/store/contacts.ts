import { defineStore } from "pinia";
import { StoreNames } from "@/enums";
import { LocalStorageKeys } from "@/enums";

export enum IndividualGender {
  MALE = "male",
  FEMALE = "female",
}

export interface Individual {
  id: number;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  alias: string | null;
  note: string | null;
  gender: IndividualGender;
  hasDied: boolean;
  dateOfBirth: Date | null;
  dateOfDeath: Date | null;
}

export const useContactsStore = defineStore(StoreNames.CONTACTS, {
  state: () => ({
    individuals: [] as Individual[],
  }),
  actions: {
    async findAll() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";
      const response = await fetch("http://localhost:3000/v1/individuals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.individuals = await response.json();
      }
    },
  },
});
