import "./ExpenseManager.scss";
import avatar from "../assets/user-avatar.png";
import ExpenseToolbar from "../components/ExpenseToolbar";
import TotalAmount from "../components/TotalAmount";
import ExpensesTable from "../components/ExpensesTable";
import { ClipLoader } from "react-spinners";
import ExpenseChart from "../components/ExpenseChart";
import { useExpense } from "../hooks/useExpense";
import { useCategories } from "../hooks/useCategory";
import useFiltersStore from "../stores/useFiltersStore";

const ExpenseManager = () => {
  const { filters } = useFiltersStore();
  const { isLoading: expensesLoading, isError: expensesError, error: expensesErrorMessage } = useExpense(filters);

  const { isLoading: categoriesLoading, isError: categoriesError, error: categoriesErrorMessage } = useCategories();

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
          <ExpenseToolbar />
          <hr />
          <div className="middle">
            <div className="left">
              <TotalAmount />
              <ExpensesTable />
            </div>
            <div className="right">
              <ExpenseChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
