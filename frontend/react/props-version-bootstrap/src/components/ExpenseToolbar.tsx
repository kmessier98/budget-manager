import "./ExpenseToolbar.scss";
import type { Filters } from "../models/expense/expenses";
import { useState } from "react";
import AddExpenseModal from "../Modals/AddExpenseModal";
import { toast } from "react-hot-toast";

const startYear = 1900;
const currentYear = new Date().getFullYear();
const years = [
  { value: currentYear.toString(), label: currentYear.toString() },
];
const months = [
  { value: "", label: "Aucun" },
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

for (let year = currentYear - 1; year >= startYear; year--) {
  years.push({
    value: year.toString(),
    label: year.toString(),
  });
}

type ExpenseToolbarProps = {
  filters: Filters;
  daysInMonth: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  onFiltersChange: (newFilters: Filters) => void;
  onAddExpenseSuccess: () => void;
};

const ExpenseToolbar = ({
  filters,
  daysInMonth,
  categories,
  onFiltersChange,
  onAddExpenseSuccess,
}: ExpenseToolbarProps) => {
  const [open, setOpen] = useState(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      year: e.target.value,
      day: "",
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      month: e.target.value,
      day: "",
    });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      day: e.target.value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      categoryId: e.target.value,
    });
  };

  const handleSaveSuccess = () => {
    setOpen(false);
    toast.success("Dépense ajoutée avec succès !");
    onAddExpenseSuccess();
  };

  return (
    <div className="expense-toolbar-container">
      <div className="expense-toolbar">
        <div className="form-group">
          <label htmlFor="year">Année</label>
          <select id="year" value={filters.year} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="month">Mois</label>
          <select
            id="month"
            value={filters.month}
            onChange={handleMonthChange}
            className="border rounded px-2 py-1"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="day">Jour</label>
          <select id="day" value={filters.day} onChange={handleDayChange}>
            {daysInMonth.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            value={filters.categoryId}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <button onClick={() => setOpen(true)}>Ajouter une dépense</button>
        </div>
      </div>
      {open && (
        <AddExpenseModal
          categories={categories}
          onClose={() => setOpen(false)}
          onSaveSuccess={() => {
            handleSaveSuccess();
          }}
        />
      )}
    </div>
  );
};

export default ExpenseToolbar;
