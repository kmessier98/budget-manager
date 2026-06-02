<script setup lang="ts">
import { useExpenseStore } from "../stores/expense";
import { storeToRefs } from "pinia";
import Dialog from "primevue/dialog";
import type { Expense } from "../models/expense/expense";
import Button from "primevue/button";

const expenseStore = useExpenseStore();
const { expenses } = storeToRefs(expenseStore);
const props = defineProps<{
  expenseToDelete: Expense | null;
}>();
const emit = defineEmits(["close", "deleted"]);

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-CA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}
</script>

<template>
  <div>
    <Dialog
      header="Supprimer la dépense"
      :visible="true"
      modal
      @update:visible="emit('close')"
      class="delete-expense-dialog"
      :style="{ width: '600px', 'max-width': '90%' }"
    >
      <div class="content">
        <div class="header">
          <div class="header-title">
            <h3>Êtes-vous sûr de vouloir supprimer cette dépense ?</h3>
          </div>
          <hr />
        </div>
        <div class="body">
          <div class="infos">
            <div>
              <label>Catégorie:</label>
              <span>{{ props.expenseToDelete?.category.name }}</span>
            </div>
            <div>
              <label>Montant:</label>
              <span>{{
                formatAmount(props.expenseToDelete?.amount ?? 0)
              }}</span>
            </div>
            <div>
              <label>Date:</label>
              <span>{{ formatDate(props.expenseToDelete?.date ?? "") }}</span>
            </div>
            <div>
              <label>Description:</label>
              <span>{{ props.expenseToDelete?.description }}</span>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div class="actions">
        <Button
          class="delete-button"
          label="Supprimer"
          @click="emit('deleted')"
        ></Button>
        <Button
          class="cancel-button"
          label="Annuler"
          @click="emit('close')"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss">
@use "../../../assets/scss/variables" as *;
$red: rgb(189, 3, 3);

.p-dialog-mask {
  .p-dialog.delete-expense-dialog {
    .p-dialog-header {
      background-color: $red;
      padding: 10px 10px 10px 20px;

      .p-dialog-title {
        font-size: 1.5rem;
        color: $color-1;
        color: #fff;
      }

      .p-dialog-close-button {
        background: none;
        border: none;
        font-size: 2rem;
        color: #fff;

        svg {
          color: #fff;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
$red: rgb(189, 3, 3);

hr {
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 10px;

  .header {
    .header-title {
      padding: 15px 30px;

      h3 {
        color: $color-1;
        font-weight: 700;
      }
    }
  }

  .body {
    padding: 0 30px;
    color: $color-1;
    font-size: 1rem;

    .infos {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        width: 90px;
        font-size: 0.875rem;
        font-weight: 500;
        font-size: medium;
      }

      span {
        font-size: 1rem;
        font-weight: 700;
      }
    }
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;

  .cancel-button {
    background-color: #ccc;
    color: $color-1;
    font-weight: 400;
    border: none;

    &:hover {
      background-color: #bbb;
      border: none;
      color: $color-1;
    }
  }

  .delete-button {
    background-color: $red;
    color: #fff;
    font-weight: 400;
    border: none;

    &:hover {
      background-color: rgb(189, 3, 3, 0.9);
      border: none;
    }
  }
}
</style>
