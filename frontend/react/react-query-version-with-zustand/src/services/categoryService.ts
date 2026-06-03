import type { Category } from "../models/category/category";

export const categoryService = {
  fetchCategories: async (): Promise<Category[]> => {
    console.log("Fetching categories from API...");
    const response = await fetch("https://localhost:7208/api/category");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },
};
