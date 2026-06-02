import { ref, watch } from "vue";
import { defineStore } from "pinia";
import type { ExpenseResponse, Filters } from "../models/expense/expense";

export const useExpenseStore = defineStore("expense", () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const expenses = ref<ExpenseResponse | null>(null);
  const filters = ref<Filters>({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    categoryId: "",
    pageNumber: "1",
    pageSize: "10",
  });

  function setYear(year: string) {
    filters.value.year = year;
    filters.value.day = "";
  }

  function setMonth(month: string) {
    filters.value.month = month;
    filters.value.day = "";
  }

  const fetchExpenses = async (filters: Filters): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams(
        filters as Record<string, string>,
      ).toString();

      const response = await fetch(`/api/transaction?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      expenses.value = await response.json();
      console.log("Fetched expenses:", expenses.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  watch(
    filters,
    async (newFilters) => {
      await fetchExpenses(newFilters);
      console.log("Filters changed:", newFilters);
      console.log("Current expenses:", expenses.value);
    },
    { immediate: true, deep: true }, // deep: true est essentiel pour les objet
  );

  return {
    error,
    loading,
    filters,
    setYear,
    setMonth,
    fetchExpenses,
    expenses,
  };
});
