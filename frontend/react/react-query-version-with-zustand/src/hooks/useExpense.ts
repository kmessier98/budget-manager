import { expenseService } from "../services/expenseService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  type ExpenseFormValues,
} from "../models/expense/expenses";

export const useExpense = (filters: Record<string, string | number>) => { 
    return useQuery({
        // inclure les filtres dans la clé pour recharger l'API quand ils changent

        queryKey: ["expenses", filters],
        queryFn: () => expenseService.fetchExpenses(filters),
    });
}

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData: ExpenseFormValues) => expenseService.addExpense(formData),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
}

export const useDeleteExpenseMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (expenseId: string) => expenseService.deleteExpense(expenseId),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
}

export const useUpdateExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: ExpenseFormValues) => expenseService.updateExpense(formData),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
}