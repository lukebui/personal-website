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

export interface ParentalType {
  id: number;
  type: string;
}

export interface Couple {
  id: number;
  partner1: Individual;
  partner2: Individual;
  stillMarried: boolean;
}

export interface ParentalLink {
  id: number;
  type: ParentalType;
  parentCouple: Couple;
  child: Individual;
}

export const useContactsStore = defineStore(StoreNames.CONTACTS, {
  state: () => ({
    individuals: [] as Individual[],
    couples: [] as Couple[],
    parentalTypes: [] as ParentalType[],
    parentalLinks: [] as ParentalLink[],
  }),
  actions: {
    fetch() {
      return Promise.all([
        this.findAllIndividuals(),
        this.findAllCouples(),
        this.findAllParentTypes(),
        this.findAllParents(),
      ]);
    },
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
    async findAllCouples() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";
      const response = await fetch("http://localhost:3000/v1/couples", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.couples = await response.json();
      }
    },
    async findAllParentTypes() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";
      const response = await fetch("http://localhost:3000/v1/parental-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.parentalTypes = await response.json();
      }
    },
    async findAllParents() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";
      const response = await fetch("http://localhost:3000/v1/parental-links", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.parentalLinks = await response.json();
      }
    },
  },
});
