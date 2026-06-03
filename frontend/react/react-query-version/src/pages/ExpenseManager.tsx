import "./ExpenseManager.scss";
import avatar from "../assets/user-avatar.png";
import ExpenseToolbar from "../components/ExpenseToolbar";
import { useMemo, useState } from "react";
import type { Filters } from "../models/expense/expenses";
import TotalAmount from "../components/TotalAmount";
import ExpensesTable from "../components/ExpensesTable";
import { ClipLoader } from "react-spinners";
import ExpenseChart from "../components/ExpenseChart";
import { useExpense } from "../hooks/useExpense";
import { useCategories } from "../hooks/useCategory";

const ExpenseManager = () => {
  const [filters, setFilters] = useState<Filters>(() => {
    const now = new Date();
    return {
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString(),
      day: now.getDate().toString(),
      categoryId: "",
      pageNumber: 1,
      pageSize: 10,
    };
  });

  const {
    data: expensesData,
    isLoading: expensesLoading,
    isError: expensesError,
    error: expensesErrorMessage,
  } = useExpense(filters);

  const { isLoading: categoriesLoading, isError: categoriesError, error: categoriesErrorMessage } = useCategories();

  const daysInMonth = useMemo(() => {
    const month = parseInt(filters.month);
    const year = parseInt(filters.year);

    if (!month) return [{ value: "", label: "Aucun" }];

    const numberOfDays = new Date(year, month, 0).getDate();
    const newDays = [{ value: "", label: "Aucun" }];

    for (let day = 1; day <= numberOfDays; day++) {
      newDays.push({ value: day.toString(), label: day.toString() });
    }

    return newDays;
  }, [filters.month, filters.year]);

  const isLoading = expensesLoading || categoriesLoading;
  if (isLoading) {
    return (
      <div className="spinner">
        <ClipLoader color="#36d7b7" loading={isLoading} size={150} aria-label="Chargement en cours" />
      </div>
    );
  }

  if (expensesError) {
    return (
      <div className="expense-manager">
        Error: {expensesErrorMessage instanceof Error ? expensesErrorMessage.message : ""}
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="expense-manager">
        Error: {categoriesErrorMessage instanceof Error ? categoriesErrorMessage.message : ""}
      </div>
    );
  }

  return (
    <div className="expense-manager">
      <div className="expense-manager-content">
        <div className="top">
          <img src={avatar} alt="User Avatar" />
          <h1>Gestionnaire de dépenses</h1>
        </div>
        <hr />
        <div className="content">
          <ExpenseToolbar
            filters={filters}
            daysInMonth={daysInMonth}
            onFiltersChange={(newFilters: Filters) => setFilters(newFilters)}
          />
          <hr />
          <div className="middle">
            <div className="left">
              {expensesData && <TotalAmount summaryExpense={expensesData.summary} />}
              {expensesData && (
                <ExpensesTable
                  expenseResponse={expensesData}
                  onPaginationChange={(newPagination) => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      pageNumber: newPagination.pageIndex + 1,
                      pageSize: newPagination.pageSize,
                    }));
                  }}
                  pagination={{
                    pageIndex: filters.pageNumber - 1,
                    pageSize: filters.pageSize,
                  }}
                />
              )}
            </div>
            <div className="right">{expensesData && <ExpenseChart data={expensesData.summary.amountByCategory} />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
