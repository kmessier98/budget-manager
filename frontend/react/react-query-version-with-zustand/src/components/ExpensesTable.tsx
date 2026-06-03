import "./ExpenseTable.scss";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import ModifyExpenseModal from "../Modals/ModifyExpenseModal";
import { toast } from "react-hot-toast";
import { useDeleteExpenseMutation } from "../hooks/useExpense";
import useFiltersStore from "../stores/useFiltersStore";
import { useExpense } from "../hooks/useExpense";

type Expense = {
  id: string;
  date: string;
  categorie: {
    id: string;
    name: string;
  };
  description: string;
  amount: string;
};

const columnHelper = createColumnHelper<Expense>();

const ExpensesTable = () => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const deleteExpenseMutation = useDeleteExpenseMutation();
  const { filters, setFilters } = useFiltersStore();
  const { data: expenseResponse } = useExpense();

  const handleDelete = async (id: string) => {
    await toast.promise(
      (async () => {
        await deleteExpenseMutation.mutateAsync(id);
      })(),
      {
        loading: "Suppression de la dépense en cours...",
        success: "Dépense supprimée avec succès",
        error: (err) =>
          `Échec de la suppression : ${err instanceof Error ? err.message : ""}`,
      },
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return new Intl.DateTimeFormat("fr-CA", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(date);
        },
      }),
      columnHelper.accessor("categorie", {
        header: "Catégorie",
        cell: (info) => info.getValue().name,
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("amount", {
        header: "Montant",
        cell: (info) => {
          const amount = parseFloat(info.getValue());
          return new Intl.NumberFormat("fr-CA", {
            style: "currency",
            currency: "CAD",
          }).format(amount);
        },
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
                onClick={() => handleDelete(row.id)}
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
    console.log("ExpenseResponse in ExpensesTable:", expenseResponse);
    return (
      expenseResponse?.transactions.map((expense) => {
        return {
          id: expense.id,
          date: expense.date,
          categorie: expense.category,
          description: expense.description,
          amount: expense.amount.toFixed(2),
        };
      }) ?? []
    );
  }, [expenseResponse]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: expenseResponse?.metadata.totalItems ?? 0,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setFilters({
        pageNumber: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      });
    },
    state: {
      pagination: {
        pageIndex: filters.pageNumber - 1,
        pageSize: filters.pageSize,
      },
    },
  });

  const handleEdit = (row: Expense) => {
    setEditingExpense(row);
  };

  const handleUpdateSuccess = () => {
    toast.success("Dépense modifiée avec succès !");
    setEditingExpense(null);
  };

  return (
    <>
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
      <div className="pagination-table">
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        Page {table.getState().pagination.pageIndex + 1} sur{" "}
        {table.getPageCount()}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
      {editingExpense && (
        <ModifyExpenseModal
          id={editingExpense.id}
          categoryId={editingExpense.categorie.id}
          date={editingExpense.date}
          description={editingExpense.description}
          amount={editingExpense.amount}
          onClose={() => setEditingExpense(null)}
          onUpdateSuccess={() => {
            handleUpdateSuccess();
          }}
        />
      )}
    </>
  );
};

export default ExpensesTable;
