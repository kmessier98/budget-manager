import "./TotalAmount.scss";
import { useExpense } from "../hooks/useExpense";
import useFiltersStore from "../stores/useFiltersStore";
import { useMemo } from "react";

const TotalAmount = () => {
  const { filters } = useFiltersStore();
  const { data: expenseData } = useExpense(filters);

  const summaryExpense = useMemo(() => {
    if (!expenseData) {
      return;
    }
    return expenseData.summary;
  }, [expenseData]);

  const getFormatedText = () => {
    const date = new Date(
      summaryExpense?.year ? parseInt(summaryExpense.year) : 0,
      summaryExpense?.month ? parseInt(summaryExpense.month) - 1 : 0,
      summaryExpense?.day ? parseInt(summaryExpense.day) : 1,
    );

    console.log(summaryExpense);
    console.log(date);

    if (summaryExpense?.day) {
      return `Total du ${date.getDate()} ${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()} : ${formatedAmount}`;
    } else if (summaryExpense?.month) {
      if (summaryExpense.month == "4" || summaryExpense.month == "8" || summaryExpense.month == "10") {
        return `Total du mois d'${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()} : ${formatedAmount}`;
      }
      return `Total du mois de ${date.toLocaleString("fr-FR", { month: "long" })} ${date.getFullYear()} : ${formatedAmount}`;
    }

    return `Total de l'année ${date.getFullYear()} : ${formatedAmount}`;
  };

  const formatedAmount = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(summaryExpense?.totalAmount || 0);

  return (
    <div className="total-expense-container">
      <h2>{getFormatedText()}</h2>
    </div>
  );
};

export default TotalAmount;
