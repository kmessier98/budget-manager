import {
  type ExpenseFormValues,
  type ExpenseResponse,
} from "../models/expense/expenses";

export const expenseService = {
  fetchExpenses: async (
    queryParams: Record<string, string | number>,
  ): Promise<ExpenseResponse> => {
    const queryString = new URLSearchParams(
      queryParams as Record<string, string>,
    ).toString();
    const response = await fetch(
      `https://localhost:7208/api/transaction?${queryString}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    return response.json();
  },
  addExpense: async (formData: ExpenseFormValues) => {
    const response = await fetch("https://localhost:7208/api/transaction", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add expense");
    }

    return response.json();
  },
  deleteExpense: async (id: string) => {
    const response = await fetch(
      `https://localhost:7208/api/transaction/${id}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }
  },
  updateExpense: async (formData: ExpenseFormValues) => {
    const response = await fetch(
      `https://localhost:7208/api/transaction/${formData.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update expense");
    }

    return response.json();
  },
};
