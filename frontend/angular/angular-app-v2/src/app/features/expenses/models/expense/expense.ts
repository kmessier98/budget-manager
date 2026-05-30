import { type PaginationMetadata } from '../../../../models/pagination';

export type Filters = {
  year: string;
  month: string;
  day: string;
  categoryId: string;
};

export type ExpenseFormValues = {
  id?: string;
  amount: number;
  categoryId: string;
  date: string;
  description: string;
};

export interface ExpenseResponse {
  transactions: Expense[];
  metadata: PaginationMetadata;
  summary: ExpenseSummary;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
}

export interface ExpenseSummary {
  totalAmount: number;
  day: string;
  month: string;
  year: string;
  category: string;
  amountByCategory: CategoryAmount[];
}

export interface CategoryAmount {
  id: string;
  name: string;
  amount: number;
}
