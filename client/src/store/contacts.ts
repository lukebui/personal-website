import { defineStore } from "pinia";
import { StoreNames } from "@/enums";
import { LocalStorageKeys } from "@/enums";
import _ from "lodash";

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
  fullName: string;
  note: string | null;
  gender: IndividualGender | null;
  hasDied: boolean;
  dateOfBirth: Date | null;
  dateOfDeath: Date | null;
}

export interface ParentType {
  id: number;
  type: string;
}

export interface ParentChildRelationship {
  id: number;
  type: ParentType;
  parent: Individual;
  child: Individual;
}

export interface IndividualWithRelations extends Individual {
  parents: ParentChildRelationship[];
  children: ParentChildRelationship[];
}

export const useContactsStore = defineStore(StoreNames.CONTACTS, {
  state: () => ({
    individuals: [] as IndividualWithRelations[],
    parentTypes: [] as ParentType[],
    parents: [] as ParentChildRelationship[],
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
        this.individuals = _.sortBy(
          (await response.json()) as IndividualWithRelations[],
          (individual) => individual.fullName
        );
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
