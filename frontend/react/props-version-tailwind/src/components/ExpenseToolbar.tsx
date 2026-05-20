import "./ExpenseToolbar.css";
import { useState } from "react";

const ExpenseToolbar = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  return (
    <div className="expense-toolbar flex py-4 gap-4">
      <div className="flex flex-col">
        <label htmlFor="month">Mois</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Sélectionner un mois</option>
          <option value="January">January</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="category">Catégorie</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="year">Année</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Sélectionner une année</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="day">Jour</label>
        <select
          id="year"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Sélectionner une journée</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="26">26</option>
          <option value="27">27</option>
          <option value="28">28</option>
          <option value="29">29</option>
          <option value="30">30</option>
          <option value="31">31</option>
        </select>
      </div>
      <button
        type="button"
        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
      >
        Default
      </button>
    </div>
  );
};

export default ExpenseToolbar;
