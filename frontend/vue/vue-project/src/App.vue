<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
  <header>
    <AppHeader />
  </header>

  <main>
    <RouterView />
  </main>

  <AppFooter />
</template>

<style scoped></style>
