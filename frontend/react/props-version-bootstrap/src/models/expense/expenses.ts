export type Filters = {
  year: string;
  month: string;
  day: string;
  categoryId: string;
};

export type ExpenseFormValues = {
  amount: number;
  categoryId: string;
  date: string;
  description: string;
};