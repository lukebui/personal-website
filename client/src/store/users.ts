import { defineStore } from "pinia";
import { type UserRecord, LocalStorageKeys, StoreNames } from "@/utils";

export const useUserStore = defineStore(StoreNames.USERS, {
  state: () => ({
    user: null as UserRecord | null,
  }),
  actions: {
    async validateUser(email: string, password: string): Promise<true> {
      const response = await fetch("http://localhost:3000/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result: { user: UserRecord; accessToken: string } =
          await response.json();
        this.user = result.user;
        localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, result.accessToken);
        return true;
      } else {
        throw new Error(response.statusText);
      }
    },
    doesTokenExist() {
      return !!localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
    },
    async validateToken() {
      const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN) || "";

      if (!token) {
        throw new Error("Token cannot be empty.");
      }

      const response = await fetch("http://localhost:3000/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result: UserRecord = await response.json();
        this.user = result;
      } else {
        throw new Error(response.statusText);
      }
    },
    removeUser() {
      localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
      this.user = null;
    },
  },
});
