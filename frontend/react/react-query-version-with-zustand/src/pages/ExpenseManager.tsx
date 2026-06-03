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
    };
  });

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const expenseQuery = useExpense({
    ...filters,
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
  });
  const categoriesQuery = useCategories();

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

  const categoriesOptions = useMemo(() => {
    const options = [{ value: "", label: "Toutes les catégories" }];
    categoriesQuery.data?.forEach((cat) => {
      options.push({ value: cat.id, label: cat.name });
    });

    return options;
  }, [categoriesQuery.data]);

  const isLoading = expenseQuery.isLoading || categoriesQuery.isLoading;
  if (isLoading && !expenseQuery.data && !categoriesQuery.data) {
    return (
      <div className="spinner">
        <ClipLoader
          color="#36d7b7"
          loading={isLoading}
          size={150}
          aria-label="Chargement en cours"
        />
      </div>
    );
  }

  if (expenseQuery.isError) {
    return (
      <div className="expense-manager">
        Error:{" "}
        {expenseQuery.error instanceof Error ? expenseQuery.error.message : ""}
      </div>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <div className="expense-manager">
        Error:{" "}
        {categoriesQuery.error instanceof Error
          ? categoriesQuery.error.message
          : ""}
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
            categories={categoriesOptions}
            onFiltersChange={(newFilters: Filters) => setFilters(newFilters)}
          />
          <hr />
          <div className="middle">
            <div className="left">
              {expenseQuery.data && (
                <TotalAmount summaryExpense={expenseQuery.data.summary} />
              )}
              {expenseQuery.data && categoriesQuery.data && (
                <ExpensesTable
                  expenseResponse={expenseQuery.data}
                  categories={categoriesQuery.data}
                  onPaginationChange={(newPagination) => {
                    setPagination({
                      pageNumber: newPagination.pageIndex + 1,
                      pageSize: newPagination.pageSize,
                    });
                  }}
                  pagination={{
                    pageIndex: pagination.pageNumber - 1,
                    pageSize: pagination.pageSize,
                  }}
                />
              )}
            </div>
            <div className="right">
              {expenseQuery.data && (
                <ExpenseChart
                  data={expenseQuery.data.summary.amountByCategory}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
