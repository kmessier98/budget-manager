import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ExpenseResponse,  Filters } from "../models/expense/expenses";

type ExpenseFilters = Filters & {
  pageNumber: number;
  pageSize: number;
}

export const expenseApiSlice = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7208/api/" }),

  // Les "tagTypes" permettent de synchroniser le cache.
  // Quand on ajoute/supprime/modifie une dépense, la liste se recharge TOUTE SEULE.
  tagTypes: ["Expense"],

  endpoints: (builder) => ({
    getExpenses: builder.query<ExpenseResponse, ExpenseFilters>({
      query: (params) => ({
        url: "transaction",
        params, 
      }),
      providesTags: ["Expense"],
    }),
    addExpense: builder.mutation({
      query: (formData) => ({
        url: "transaction",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation({
      query: (formData) => ({
        url: "transaction",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `transaction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
    }),
});

export const { useGetExpensesQuery, useAddExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation } = expenseApiSlice;
