import { ref } from "vue";
import { useExpenseStore } from "@/features/expenses/stores/expense";
import type { Expense, ExpenseFormValues } from "../models/expense/expense";

export function useExpenseApi() {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const addExpense = async (expenseData: ExpenseFormValues): Promise<Expense> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding expense:", errorData);
        throw new Error(errorData.message || errorData.error || "Une erreur est survenue");
      }
      return await response.json();
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateExpense = async (expenseId: string, expenseData: ExpenseFormValues): Promise<Expense> => {
    loading.value = true;
    error.value = null;
    console.log("Updating expense with ID:", expenseId, "and data:", expenseData);
    try {
      const response = await fetch(`/api/transaction/${expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating expense:", errorData);
        throw new Error(errorData.message || errorData.error || "Une erreur est survenue");
      }
      return await response.json();
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteExpense = async (expenseId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/transaction/${expenseId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting expense:", errorData);
        throw new Error(errorData.message || errorData.error || "Une erreur est survenue");
      }
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, addExpense, updateExpense, deleteExpense };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
