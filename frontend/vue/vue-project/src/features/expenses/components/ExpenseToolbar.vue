<script setup lang="ts">
import { ref, computed } from "vue";
import { useExpenseStore } from "../../../stores/expense";
import { useCategoryStore } from "../../../stores/category";
import { storeToRefs } from 'pinia';
import Select from 'primevue/select';
import ExpenseFormModal from "./ExpenseFormModal.vue";

const expenseStore = useExpenseStore();
const { filters } = storeToRefs(expenseStore);
const { setYear, setMonth } = expenseStore;
const categoryStore = useCategoryStore();
const START_YEAR = 1900;
const CURRENT_YEAR = new Date().getFullYear();
const months = [
    { value: "", label: "Aucun" },
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
];
const categories = computed(() => {
    const categories = categoryStore.categories;
    return [
        { value: '', label: 'Toutes les catégories' },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];
});

const daysInMonth = computed(() => {
    const month = parseInt(filters.value.month);
    const year = parseInt(filters.value.year);
    console.log("Calcul des jours pour le mois:", month, "et l'année:", year + " et le jour:", filters.value.day);
    if (!month) return [{ value: "", label: "Aucun" }];

    const numberOfDays = new Date(year, month, 0).getDate();
    const newDays = [{ value: "", label: "Aucun" }];

    for (let day = 1; day <= numberOfDays; day++) {
        newDays.push({ value: day.toString(), label: day.toString() });
    }

    return newDays;
});
const years = computed(() => {
    const result = [];
    for (let year = CURRENT_YEAR; year >= START_YEAR; year--) {
        result.push({ value: year.toString(), label: year.toString() });
    }
    return result;
});
const monthModel = computed({
    get: () => { filters.value.month; console.log(filters.value.month); console.log(filters.value.day); return filters.value.month },
    set: (value) => setMonth(value)
})
const yearModel = computed({
    get: () => filters.value.year,
    set: (value) => setYear(value)
})
const dayModel = computed({
    // ⚠️ CAS SPÉCIAL PRIME VUE & CHAÎNE VIDE "" ⚠️
    // Problème : Si on change le mois, le jour doit revenir sur "" (Aucun). 
    // Cependant, PrimeVue n'accepte pas la chaîne vide "" via l'attribut 'optionValue' 
    // et affiche une case VIDE (blanc graphique) au lieu de sélectionner l'option "Aucun".
    // 
    // 💡 Alternative écartée : On aurait pu mettre le jour à 0 au lieu de "", ce qui fonctionne 
    // avec PrimeVue. Cependant, cela aurait obligé à modifier le type dans le store et à 
    // s'assurer de reconvertir le 0 en "" juste avant l'envoi au backend pour ne pas polluer l'API.
    //
    // ✔️ Solution retenue : On supprime 'optionValue' du HTML pour forcer PrimeVue à manipuler l'OBJET 
    // complet, ce qui contourne son bug interne sans impacter le store ni le backend.
    get: () => {
        const currentDayValue = filters.value.day;
        return daysInMonth.value.find(d => d.value === currentDayValue);
    },
    set: (selectedOption) => {
        filters.value.day = selectedOption ? selectedOption.value : "";
    }
});
const categoryModel = computed({
    // Même problème que pour le jour : PrimeVue ne gère pas la chaîne vide "" avec 'optionValue',
    get: () => {
        const currentCategoryId = filters.value.categoryId;
        return categories.value.find(c => c.value === currentCategoryId);
    },
    set: (selectedOption) => {
        filters.value.categoryId = selectedOption ? selectedOption.value : "";
    }
});

const isModalOpen = ref(false);

function handleSavedExpense() {
    isModalOpen.value = false;
    //todo alert message success
}

</script>

<template>
    <div class="expense-toolbar-container">
        <div class="expense-toolbar">
            <div class="form-group">
                <label for="year">Année</label>
                <Select v-model="yearModel" :options="years" optionLabel="label" optionValue="value"
                    class="select"></Select>
            </div>
            <div class="form-group">
                <label for="month">Mois</label>
                <Select v-model="monthModel" :options="months" optionLabel="label" optionValue="value"
                    class="select"></Select>
            </div>

            <div class="form-group">
                <label for="day">Jour</label>
                <Select v-model="dayModel" :options="daysInMonth" optionLabel="label" class="select"></Select>
            </div>

            <div class="form-group">
                <label for="category">Catégorie</label>
                <Select v-model="categoryModel" :options="categories" optionLabel="label" class="select"></Select>
            </div>
            <div class="form-group">
                <button @click="isModalOpen = true">Ajouter une dépense</button>
            </div>
        </div>
        <ExpenseFormModal v-if="isModalOpen" @close="isModalOpen = false" @submit="handleSavedExpense" />
    </div>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/variables' as *;

.expense-toolbar {
    display: flex;
    padding: 16px 0;
    gap: 16px;

    @media (max-width: 1350px) {
        flex-direction: column;
        align-items: stretch;
    }

    .form-group {
        display: flex;
        flex-direction: column;

        @media (max-width: 1350px) {
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }

        label,
        .select {
            color: $color-1;
            font-size: 1rem;
            font-weight: 500;
        }

        label {
            font-weight: 700;
        }

        label {
            @media (max-width: 1350px) {
                width: 100px;
            }
        }

        .select {
            width: 250px;
        }

        .select {
            @media (max-width: 1350px) {
                width: 100%;
            }
        }

        button {
            background-color: $color-1;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            margin-top: auto;

            @media (max-width: 1350px) {
                display: block;
                width: 100%;
            }

            &:hover {
                background-color: $background-color-3;
            }
        }
    }
}
</style>
