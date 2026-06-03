import { create } from "zustand";
import { type Filters } from "../models/expense/expenses";

interface FiltersStore {
  filters: Filters;
  setFilters: (newFilters: Partial<Filters>) => void;
}

const useFiltersStore = create<FiltersStore>((set) => ({
  filters: {
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    categoryId: "",
    pageNumber: 1,
    pageSize: 10,
  },

  setFilters: (newFilters: Partial<Filters>) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));

export default useFiltersStore;
