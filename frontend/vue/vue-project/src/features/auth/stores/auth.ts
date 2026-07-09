import { defineStore } from "pinia";
import type { User } from "../models/user";
import type { LoginFormValues } from "../models/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loginUser(userData: LoginFormValues) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          this.logout();
          throw new Error(
            errorData.message || errorData.error || "Une erreur est survenue",
          );
        }

        await this.checkAuth();
      } catch (err) {
        this.error = (err as Error).message;
        this.logout();
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/account/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });
        if (!response.ok) {
          const errorData = await response.json();
          this.logout();
          throw new Error(
            errorData.message || errorData.error || "Une erreur est survenue",
          );
        }
        const data = await response.json();
        this.user = data;
        this.isAuthenticated = true;
      } catch (err) {
        this.error = (err as Error).message;
        this.logout();
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.loading = false;
      // Optionnel : appeler un endpoint backend pour supprimer le cookie côté serveur
    },
  },
});
