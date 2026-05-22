import {
  type ExpenseFormValues,
  type ExpenseResponse,
} from "../models/expense/expenses";

export const fetchExpenses = async (
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
};

export const addExpense = async (formData: ExpenseFormValues) => {
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
};
