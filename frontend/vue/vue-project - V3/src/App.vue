<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import Toast from 'primevue/toast';
</script>

<template>
  <header>
    <AppHeader />
  </header>

  <main>
    <RouterView />
    <Toast />
  </main>

  <AppFooter />
</template>

<style scoped></style>
