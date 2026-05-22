import "./ExpenseManager.scss";
import avatar from "../assets/user-avatar.png";
import ExpenseToolbar from "../components/ExpenseToolbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Filters } from "../models/expense/expenses";
import type { Category } from "../models/category/category";
import { fetchCategories } from "../services/categoryService";
import { fetchExpenses } from "../services/expenseService";
import TotalAmount from "../components/TotalAmount";
import ExpensesTable from "../components/ExpensesTable";
import { type ExpenseResponse } from "../models/expense/expenses";

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
  const [expense, setExpense] = useState<ExpenseResponse | null>(null);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
        const data = await fetchCategories();
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

  // Facon de forcer le reload des dépenses après l'ajout d'une dépense dans le composant ExpenseToolbar (callback)
  // Car sinon ya un erreur eslint
  // Ne pas essayé de comprendre, cest juste pour pouvoir reload la liste (useEffect est loader quand refreshKey change)
  const loadExpenses = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoadingExpenses(true);
      setError(null);
      try {
        const data = await fetchExpenses(filters);
        setExpense(data);
        console.log("Fetched expenses:", data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingExpenses(false);
      }
    };
    fetch();
  }, [filters, refreshKey]);

  if (loadingExpenses || loadingCategories) {
    return <div className="expense-manager">Loading...</div>;
  }

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
            onAddExpenseSuccess={loadExpenses}
          />
          <hr />
          <div className="middle">
            <div className="left">
              {expense && <TotalAmount summaryExpense={expense.summary} />}
              <ExpensesTable />
            </div>
            <div className="right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
