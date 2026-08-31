<script setup lang="ts">
import { computed } from "vue";
import { useExpenseStore } from "../stores/expense";
import { storeToRefs } from 'pinia';

const expenseStore = useExpenseStore();
const { expenses } = storeToRefs(expenseStore);

const formatedAmount = computed(() => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(expenses?.value?.summary?.totalAmount ?? 0);
});

const formatedTotalAmount = computed(() => {
    const summary = expenses?.value?.summary;
    const amountStr = formatedAmount.value;

    const date = new Date(
        summary?.year ? parseInt(summary.year) : 0,
        summary?.month ? parseInt(summary.month) - 1 : 0,
        summary?.day ? parseInt(summary.day) : 1
    );

    if (summary?.day) {
        return `Total du ${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()} : ${amountStr}`;
    } else if (summary?.month) {
        if (summary?.month == '4' || summary?.month == '8' || summary?.month == '10') {
            return `Total du mois d'${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()} : ${amountStr}`;
        }
        return `Total du mois de ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()} : ${amountStr}`;
    }

    return `Total de l'année ${date.getFullYear()} : ${amountStr}`;
})

</script>

<template>
    <div>
        <div class="total-expense-container">
            <h2>{{ formatedTotalAmount }}</h2>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/variables' as *;

.total-expense-container {
    background-color: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 5px 4px rgba(0, 0, 0, 0.1);

    h2 {
        margin: 0;
        padding: 0;
        @include text-style(1.5rem, $color-1, 700);
    }
}
</style>