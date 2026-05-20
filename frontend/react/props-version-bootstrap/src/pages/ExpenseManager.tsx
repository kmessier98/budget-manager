import "./ExpenseManager.scss";
import avatar from "../assets/user-avatar.png";
import ExpenseToolbar from "../components/ExpenseToolbar";

const ExpenseManager = () => {
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
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
