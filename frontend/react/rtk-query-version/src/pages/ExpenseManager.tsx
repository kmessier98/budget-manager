import "./ExpenseManager.scss";
import avatar from "../assets/user-avatar.png";
import ExpenseToolbar from "../components/ExpenseToolbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Filters } from "../models/expense/expenses";
import type { Category } from "../models/category/category";
import { categoryService } from "../services/categoryService";

import TotalAmount from "../components/TotalAmount";
import ExpensesTable from "../components/ExpensesTable";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import ExpenseChart from "../components/ExpenseChart";
import { useGetExpensesQuery } from "../api/expenseApiSlice";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const expense = useGetExpensesQuery({
    ...filters,
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
  });

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
    categories.forEach((cat) => {
      options.push({ value: cat.id, label: cat.name });
    });

    return options;
  }, [categories]);

  // Ca aurait pu se loader dans le composant ExpenseToolbar, mais on en aura besoin dans le composant table (pour modifier les dépenses)
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      setError(null);
      try {
        //simulate loading
        const data = await categoryService.fetchCategories();
        setCategories(data);
        console.log("Fetched categories:", data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const isLoading = expense.isLoading || loadingCategories;
  if (isLoading && !expense.data) {
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

  //erreur devrait etre gérer par rtk query,....
  if (error) {
    return <div className="expense-manager">Error: {error}</div>;
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
              {expense.data && (
                <TotalAmount summaryExpense={expense.data.summary} />
              )}
              {expense.data && (
                <ExpensesTable
                  expenseResponse={expense.data}
                  categories={categories}
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
              {expense.data && (
                <ExpenseChart data={expense.data.summary.amountByCategory} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
