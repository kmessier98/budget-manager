import { ref } from "vue";
import { useExpenseStore } from "@/features/expenses/stores/expense";
import type { Expense, ExpenseFormValues } from "../models/expense/expense";

export function useExpenseApi() {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const addExpense = async (
    expenseData: ExpenseFormValues,
  ): Promise<Expense> => {
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
        throw new Error("Failed to add expense");
      }
      return await response.json();
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, addExpense };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
