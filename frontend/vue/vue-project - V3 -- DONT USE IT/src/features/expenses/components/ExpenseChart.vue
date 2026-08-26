<script setup lang="ts">
import Chart from 'primevue/chart';
import { useExpenseStore } from "../stores/expense";
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const expenseStore = useExpenseStore();
const { expenses } = storeToRefs(expenseStore);

const chartData = computed(() => {
    const amountByCategory = expenses.value?.summary.amountByCategory || [];

    if (amountByCategory.length === 0) {
        return null;
    }
    const labels = amountByCategory.map(
        (item) => `${item.name} (${amountFormatter(item.amount)})`,
    );
    const data = amountByCategory.map((item) => item.amount);

    return {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF'
                ],
            }
        ]
    };
});

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    const label = context.label || '';
                    return label;
                }
            }
        }
    }
};

const amountFormatter = (value: number) => {
    const amount = parseFloat(value.toString());
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(amount);
};

</script>

<template>
    <div class="expense-chart">
        <h2>Dépenses par catégorie</h2>
        <hr />
        <div class="chart-container">
            <Chart v-if="chartData" type="doughnut" :data="chartData" :options="options" />
            <p v-else>Aucune donnée disponible pour le graphique.</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/variables' as *;

.expense-chart {
    width: 100%;
    padding: 10px 20px;

    h2 {
        @include text-style(1.5rem, $color-1, 700);
        margin-bottom: 7px;

        @media (max-width: 1350px) {
            text-align: center;
        }
    }

    .chart-container {
        margin-top: 20px;
    }
}
</style>
