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

export interface ParentType {
  id: number;
  type: string;
}

export interface Parent {
  type: ParentType;
  parent: Individual;
  child: Individual;
}

export const useContactsStore = defineStore(StoreNames.CONTACTS, {
  state: () => ({
    individuals: [] as Individual[],
    parentTypes: [] as ParentType[],
    parents: [] as Parent[],
  }),
  actions: {
    async findAllIndividuals() {
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
    async findAllParentTypes() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";
      const response = await fetch("http://localhost:3000/v1/parent-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.parentTypes = await response.json();
      }
    },
    async findAllParents() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";
      const response = await fetch("http://localhost:3000/v1/parents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.parents = await response.json();
      }
    },
  },
});
