import "./ExpenseTable.scss";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ExpenseResponse } from "../models/expense/expenses";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

type Expense = {
  date: string;
  categorie: string;
  description: string;
  amount: string;
};

const columnHelper = createColumnHelper<Expense>();

const ExpensesTable = ({
  expenseResponse,
}: {
  expenseResponse: ExpenseResponse;
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("categorie", {
        header: "Catégorie",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("amount", {
        header: "Montant",
        cell: (info) => `${info.getValue()} $`,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="actions">
              <button className="edit-button" onClick={() => handleEdit(row)}>
                <FontAwesomeIcon icon={faPencil} />
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(row)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          );
        },
      }),
    ],
    [],
  );

  const data = useMemo(() => {
    console.log("Received ExpenseResponse in ExpensesTable:", expenseResponse);

    console.log("ExpenseResponse in ExpensesTable:", expenseResponse);
    return expenseResponse.transactions.map((expense) => {
      const date = new Date(expense.date);
      const formatedDate = new Intl.DateTimeFormat("fr-CA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
      return {
        date: formatedDate,
        categorie: expense.category.name,
        description: expense.description,
        amount: expense.amount.toFixed(2),
      };
    });
  }, [expenseResponse]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (row: Expense) => {
    console.log("Edit row:", row);
  };

  const handleDelete = (row: Expense) => {
    console.log("Delete row:", row);
  };

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpensesTable;
