<script setup lang="ts">
import avatar from "@/assets/images/user-avatar.png";
import ExpenseToolbar from "../../components/ExpenseToolbar.vue";
import { onMounted } from "vue";
import { useCategoryStore } from "../../../../stores/category";
import ProgressSpinner from 'primevue/progressspinner';

const categoryStore = useCategoryStore();

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<template>
  <div>
    <div class="expense-manager">
      <div class="expense-manager-content">
        <div class="top">
          <img :src="avatar" alt="User Avatar" />
          <h1>Gestionnaire de dépenses</h1>
        </div>
        <hr />
        <div class="content">
          <ExpenseToolbar />
          <hr />
          <div class="middle">
            <div class="left">
              <app-expense-total-amount></app-expense-total-amount>
              <app-expense-table></app-expense-table>
            </div>
            <div class="right">
              <app-expense-chart></app-expense-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="progress-overlay" v-if="categoryStore.loading">
    <ProgressSpinner ariaLabel="loading" strokeWith="5" animationDuration=".5s" class="progress-spinner" />
  </div>

</template>

<style lang="scss" scoped>
@use '../../../../assets/scss/variables' as *;

.expense-manager {
  background-color: $background-color-1;
  flex: 1; // Le parent (main-content) doit être un flex container pour que cela fonctionne
  display: flex;

  .expense-manager-content {
    background-color: $background-color-2;
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex: 1;

    .top {
      display: flex;
      align-items: center;
      padding: 5px 20px;

      img {
        height: 60px;
        width: 60px;
        mix-blend-mode: multiply;
      }

      h1 {
        @include text-style(1.5rem, $color-1, 600);
        margin: 0;
      }
    }

    .content {
      padding: 0 30px;

      .middle {
        display: flex;
        padding: 10px 0;

        @media (max-width: 1350px) {
          flex-direction: column;
        }

        .left {
          display: flex;
          flex-direction: column;
          width: 70%;
          gap: 10px;

          @media (max-width: 1350px) {
            width: 100%;
          }
        }

        .right {
          width: 30%;

          @media (max-width: 1350px) {
            width: 100%;
          }
        }
      }
    }
  }
}

/*
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
  */
</style>