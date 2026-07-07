<script setup lang="ts">
import { reactive } from "vue";
import type { RegisterFormValues } from "@/features/expenses/models/auth/auth";
import { useAuthApi } from "@/features/expenses/composables/useAuthApi";
import { useToast } from "primevue";
import { useRouter } from "vue-router";

const form = reactive<RegisterFormValues>({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
});

const toast = useToast();
const router = useRouter();

const { registerUser, error, loading } = useAuthApi();

async function handleSubmit() {
  await registerUser(form);

  if (error.value) {
    console.error("Erreur lors de l'inscription:", error.value);
  } else {
    toast.add({
      severity: "success",
      summary: "Inscription réussie",
      detail: "Vous pouvez maintenant vous connecter.",
      life: 3000,
    });
    form.email = "";
    form.password = "";
    form.firstName = "";
    form.lastName = "";
    router.push("/login");
  }
}
</script>

<template>
  <div class="container">
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div>
          <div>
            <label for="firstName">Prénom:</label>
            <input
              type="text"
              id="firstName"
              v-model="form.firstName"
              autocomplete="off"
              required
            />
          </div>

          <div>
            <label for="lastName">Nom de famille:</label>
            <input
              type="text"
              id="lastName"
              v-model="form.lastName"
              autocomplete="off"
              required
            />
          </div>
          <label for="email">Adresse courriel:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            autocomplete="off"
          />
        </div>

        <div>
          <label for="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            autocomplete="off"
          />
        </div>

        <div class="login-btn"><button type="submit">S'inscrire</button></div>
        <span class="login-link"
          >Déjà un compte ? <a href="/login">Connectez-vous</a></span
        >
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 82vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .form-container {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    width: 400px;

    form {
      display: flex;
      flex-direction: column;

      div {
        margin-bottom: 15px;

        label {
          display: block;
          margin-bottom: 5px;
        }

        input {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
      }

      .login-btn {
        margin-top: auto;

        button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;

          &:hover {
            background-color: #0056b3;
          }
        }
      }

      .login-link {
        display: block;
        text-align: center;

        a {
          color: #007bff;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
