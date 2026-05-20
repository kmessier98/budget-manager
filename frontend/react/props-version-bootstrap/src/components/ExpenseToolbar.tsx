import { useState } from "react";
import "./ExpenseToolbar.scss";

const currentYear = new Date().getFullYear();
const startYear = 1900;
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

const categories = [
  { value: "", label: "Aucune" },
  { value: "Food", label: "Food" },
  { value: "Transport", label: "Transport" },
  { value: "Entertainment", label: "Entertainment" },
];

const ExpenseToolbar = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedDay, setSelectedDay] = useState("");
  const [days, setDaysInMonth] = useState([{ value: "", label: "Aucun" }]);

  //TODO parent aura un callback: onDatecChange(year, month, day) et onCategoryChange(category)

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setSelectedDay("");

    if (selectedMonth !== "") {
      resetDaysInMonth(parseInt(selectedMonth), parseInt(e.target.value));
    }

    //todo call parent with empty day
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setSelectedDay("");

    if (e.target.value == "") {
      setDaysInMonth([{ value: "", label: "Aucun" }]);
    } else {
      resetDaysInMonth(parseInt(e.target.value), parseInt(selectedYear));
    }

    //todo call parent with empty day
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(e.target.value);
    //todo call parent
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    //todo call parent
  };

  const resetDaysInMonth = (month: number, year: number) => {
    const numberOfDays = new Date(year, month, 0).getDate();

    const newDays = [{ value: "", label: "Aucun" }];
    for (let day = 1; day <= numberOfDays; day++) {
      newDays.push({ value: day.toString(), label: day.toString() });
    }
    setDaysInMonth(newDays);
  };

  return (
    <div className="expense-toolbar-container">
      <div className="expense-toolbar">
        <div className="form-group">
          <label htmlFor="year">Année</label>
          <select id="year" value={selectedYear} onChange={handleYearChange}>
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
            value={selectedMonth}
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
          <select id="day" value={selectedDay} onChange={handleDayChange}>
            {days.map((day) => (
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
            value={selectedCategory}
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
          <button>Ajouter une dépense</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseToolbar;
