<script setup lang="ts">
import { reactive } from "vue";
import type { LoginFormValues } from "@/features/auth/models/auth";
import { useToast } from "primevue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/features/auth/stores/auth";

const form = reactive<LoginFormValues>({
  email: "",
  password: "",
});

const toast = useToast();
const router = useRouter();

const { loginUser, error, loading } = useAuthStore();


function redirectionLogin() {
  window.location.href = "https://localhost:7208/api/auth/login";
}
</script>

<template>
  <Button @click="redirectionLogin">Se connecter</Button>
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
      height: 100%;

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
