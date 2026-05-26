import "./ExpenseChart.scss";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CategoryAmount } from "../models/expense/expenses";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
  "#546E7A",
  "#26a69a",
  "#D10CE8",
];

const ExpenseChart = ({ data }: { data: CategoryAmount[] }) => {
  const formattedData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length], // Recharts utilise automatiquement la clé "fill" de vos données
  }));

  const amountFormatter = (value: number) => {
    const amount = parseFloat(value.toString());
    return new Intl.NumberFormat("fr-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const renderLegendText = (value: string, entry: any) => {
    // entry.payload contient l'objet d'origine (votre CategoryAmount + la clé fill)
    const amount = entry.payload?.amount ?? 0;
    return (
      <span className="legend-item">
        {value} : <strong>{amountFormatter(amount)}</strong>
      </span>
    );
  };

  return (
    <div className="expense-chart">
      <h2>Dépenses par catégéories</h2>
      <hr />
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={550}>
          <PieChart margin={{ top: 20, bottom: 20, left: 30, right: 30 }}>
            <Pie
              data={formattedData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ name, percent }) => {
                if (percent === undefined) return "";
                return percent > 0.05
                  ? `${name} ${(percent * 100).toFixed(0)}%`
                  : "";
              }}
            ></Pie>
            <Tooltip formatter={(value) => amountFormatter(value as number)} />
            <Legend
              iconType="circle"
              layout="vertical"
              align="center"
              verticalAlign="bottom" // Force la légende à se placer en bas
              formatter={renderLegendText}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
