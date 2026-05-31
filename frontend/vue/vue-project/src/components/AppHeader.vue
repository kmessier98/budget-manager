<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img :src="logo" alt="App Logo" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link"
              >Gestionnaire de dépenses
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from "@/assets/images/app-logo.png";
</script>

<style lang="scss" scoped>
@use "../assets/scss/variables" as *;

nav {
  background-color: $background-color-3;

  .navbar-toggler {
    border: none;

    &:focus,
    &:active,
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }

    &:hover {
      background-color: rgba(245, 245, 245, 0.1);
      border-radius: 4px;
    }
  }

  .navbar-toggler-icon {
    // Rend l'icône complètement blanche
    filter: invert(1) brightness(100%);
  }

  a:not(.navbar-brand) {
    color: #f1f1f1 !important;
    text-decoration: none;

    &:hover {
      background-color: rgba(241, 241, 241, 0.1);
      border-radius: 4px;
    }
  }
  img {
    height: 40px;
    width: auto;
    object-fit: contain;
  }
}
</style>
