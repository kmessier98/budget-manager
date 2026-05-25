import type { Category } from '../models/category/category';

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch('https://localhost:7208/api/category');

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    
    return response.json();
}