<script setup lang="ts">
import { computed, ref } from "vue";
import { useExpenseStore } from "../stores/expense";
import { storeToRefs } from 'pinia';
import type { PaginationMetadata } from "@/models/pagination";
import type { Expense } from "../models/expense/expense";
import { useToast } from 'primevue/usetoast';
import DataTable, { type DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ExpenseFormModal from "./ExpenseFormModal.vue";

const expenseStore = useExpenseStore();
const { filters, expenses } = storeToRefs(expenseStore);
const toast = useToast();

const transactions = computed(() => {
    return expenses.value?.transactions || [];
});
const metadata = computed<PaginationMetadata>(() => {
    return expenses.value?.metadata || {} as PaginationMetadata;
});

const first = computed(() => {
    const meta = metadata.value;
    if (!meta) return 0;

    // Formule : (PageActuelle - 1) * NombreDitemsParPage
    // Exemple : (Page 2 - 1) * 10 = index 10 (la deuxième page)
    return (meta.pageNumber - 1) * meta.pageSize;
});

const isEditModalOpen = ref(false);
const isDeleteConfirmationOpen = ref(false);
const selectedExpense = ref<Expense | null>(null);


function handlePageChange(event: DataTablePageEvent) {
    console.log("Page changed:", event);
    const pageNumber = event.first / event.rows + 1; //ou event.page + 1 si event.page est disponible
    const pageSize = event.rows;

    filters.value.pageNumber = pageNumber.toString();
    filters.value.pageSize = pageSize.toString();

}
function handleEdit(transaction: Expense) {
    selectedExpense.value = transaction;
    isEditModalOpen.value = true;
}

function handleDelete(transaction: Expense) {
    selectedExpense.value = transaction;
    isDeleteConfirmationOpen.value = true;
}

function handleSavedExpense() {
    isEditModalOpen.value = false;
    selectedExpense.value = null;
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Dépense enregistrée avec succès', life: 3000 });
}

function handleDeletedExpense() {
    if (!selectedExpense.value) {
        isDeleteConfirmationOpen.value = false;
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Aucune dépense sélectionnée pour la suppression.', life: 3000 });
        return;
    }

    // call api pour delete
    isDeleteConfirmationOpen.value = false;
    selectedExpense.value = null;
    // await expenseStore.fetchExpenses(); + filters
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Dépense supprimée avec succès', life: 3000 });
}

function handleModalClose() {
    isEditModalOpen.value = false;
    isDeleteConfirmationOpen.value = false;
    selectedExpense.value = null;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-CA', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
}

</script>

<template>
    <DataTable :value="transactions" :paginator="true" :lazy="true" :rows="metadata.pageSize"
        :totalRecords="metadata.totalItems" :first="first" :rowsPerPageOptions="[5, 10, 20, 50]" class="expense-table"
        @page="handlePageChange($event)">
        <Column field="date" header="Date" class="date-cell">
            <template #body="slotProps">
                {{ formatDate(slotProps.data.date) }}
            </template>
        </Column>
        <Column field="category.name" header="Catégorie" class="category-cell"></Column>
        <Column field="description" header="Description" class="description-cell">
            <template #body="slotProps">
                <!-- Note : La directive v-tooltip.top est configurée globalement dans main.ts -->
                <span class="cell-content text-ellipsis" v-tooltip.top="slotProps.data.description">
                    {{ slotProps.data.description }}
                </span>
            </template>
        </Column>
        <Column field="amount" header="Montant" class="amount-cell">
            <template #body="slotProps">
                {{ formatAmount(slotProps.data.amount) }}
            </template>
        </Column>
        <Column header="Actions" class="actions-cell">
            <template #body="slotProps">
                <div class="actions">
                    <Button @click="handleEdit(slotProps.data)" icon="pi pi-pencil" />
                    <Button @click="handleDelete(slotProps.data)" icon="pi pi-trash" />
                </div>
            </template>
        </Column>
    </DataTable>
    <ExpenseFormModal v-if="isEditModalOpen" :expenseToEdit="selectedExpense" @close="handleModalClose"
        @submit="handleSavedExpense" />

</template>


<style lang="scss" scoped>
@use '../../../assets/scss/variables' as *;


.expense-table :deep(.p-datatable-thead > tr > th) {
    color: $color-1 ;
    background-color: #e1e6f7
}

.expense-table :deep(.p-datatable-tbody > tr) {
    background-color: #fff;

    &:hover {
        background-color: #f9f9f9;
    }
}

.expense-table :deep(.p-datatable-tbody > tr > td) {
    font-size: 0.875rem;
    color: $color-1;

    &.date-cell {
        white-space: nowrap !important;
    }

    &.amount-cell {
        font-weight: 600;
        font-size: 1rem;
    }

    &.description-cell {
        max-width: 100px;
    }

    .text-ellipsis {
        max-width: 300px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .actions {
        display: flex;
        gap: 8px;

        button {
            background-color: $color-1;
            color: #fff;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            width: 40px;

            &:hover {
                background-color: $background-color-3;
            }
        }
    }
}


.expense-table :deep(.p-paginator) {
    background-color: #e1e6f7;

    button {
        &:hover {}

        &:disabled {}
    }
}
</style>