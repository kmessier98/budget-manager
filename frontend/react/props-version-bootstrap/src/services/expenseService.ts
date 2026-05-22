import { type ExpenseFormValues } from "../models/expense/expenses";

export const addExpense = async (formData: ExpenseFormValues) => {
    const response = await fetch('https://localhost:7208/api/transaction', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to add expense');
    }

    return response.json();
}