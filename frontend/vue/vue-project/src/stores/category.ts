import { defineStore } from "pinia";
import { ref } from "vue";
import { type Category } from "../features/categories/models/category/category";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchCategories() {
    if (categories.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/category");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Category[] = await response.json();
      categories.value = data;
    } catch (err: any) {
      error.value =
        err.message ||
        "Une erreur est survenue lors du chargement des catégories.";
    } finally {
      loading.value = false;
    }
  }

  return { categories, loading, error, fetchCategories };
});
