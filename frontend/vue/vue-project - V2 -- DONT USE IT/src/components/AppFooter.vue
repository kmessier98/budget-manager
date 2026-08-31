<template>
  <div>
    <footer class="footer">
      <p>&copy; 2026 Gestionnaire de dépenses. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use "../assets/scss/variables" as *;

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: $background-color-3;
  color: #f1f1f1;

  z-index: 1000;

  p {
    margin: 0;
  }
}
</style>
