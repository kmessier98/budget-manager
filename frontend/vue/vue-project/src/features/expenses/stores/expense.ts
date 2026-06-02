import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useExpenseStore = defineStore("expense", () => {
  const filters = ref({
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

  return { filters, setYear, setMonth };
});
