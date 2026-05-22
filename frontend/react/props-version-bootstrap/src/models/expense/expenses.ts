export type Filters = {
  year: string;
  month: string;
  day: string;
  categoryId: string;
};

export type ExpenseFormValues = {
  amount: string;
  categoryId: string;
  date: string;
  description: string;
};

export interface ExpenseResponse {
  expenses: Expense[];
  pagination: PaginationMetadata;
  summary: ExpenseSummary;
}

interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
}

interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ExpenseSummary {
  totalAmount: number;
  day: string;
  month: string;
  year: string;
  category: string;
  amountByCategory: CategoryAmount[];
}

interface CategoryAmount {
  id: string;
  name: string;
  amount: number;
}
