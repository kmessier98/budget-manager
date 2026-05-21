import "./ExpenseManager.scss";
import avatar from "../assets/user-avatar.png";
import ExpenseToolbar from "../components/ExpenseToolbar";
import { useEffect, useMemo, useState } from "react";
import type { Filters } from "../types/expenses";

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

  useEffect(() => {}, [filters]);

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
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
