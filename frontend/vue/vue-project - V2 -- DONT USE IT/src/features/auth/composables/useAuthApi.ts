import { ref } from "vue";
import type { RegisterFormValues, LoginFormValues } from "../models/auth";

export function useAuthApi() {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const registerUser = async (userData: RegisterFormValues) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error register:", errorData);
        throw new Error(
          errorData.message || errorData.error || "Une erreur est survenue",
        );
      }
      return await response.json();
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    error,
    loading,
    registerUser,
  };
}
