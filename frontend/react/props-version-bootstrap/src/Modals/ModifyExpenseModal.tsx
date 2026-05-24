import "./ModifyExpenseModal.scss";
import { useForm } from "react-hook-form";
import { updateExpense } from "../services/expenseService";
import type { ExpenseFormValues } from "../models/expense/expenses";
import Modal from "./Modal";
import type { Category } from "../models/category/category";

type ModifyExpenseModal = {
  id: string;
  categories: Category[];
  categoryId: string;
  date: string;
  description: string;
  amount: string;
  onClose: () => void;
  onUpdateSuccess: () => void;
};

const ModifyExpenseModal = ({
  id,
  categories,
  categoryId,
  date,
  description,
  amount,
  onClose,
  onUpdateSuccess,
}: ModifyExpenseModal) => {
  const defaultCategoryId = categories.find((cat) => cat.id === categoryId)?.id;

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      id: id,
      amount: amount,
      date: new Date(date).toISOString().split("T")[0],
      categoryId: defaultCategoryId,
      description: description,
    },
  });

  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      setValue("amount", value.toFixed(2));
    }
  };

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    console.log("Saving expense:", data);

    try {
      await updateExpense(data);
      reset();
      onUpdateSuccess();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("root.serverError", {
        type: "server",
        message: "Failed to save expense. Please try again.",
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={true}
        onClose={() => onClose()}
        title="Modifier une dépense"
        isSubmitting={isSubmitting}
      >
        <form
          className="add-expense-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="form-group">
            <label htmlFor="amount">Montant ($):</label>
            <div className="input-container">
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                {...register("amount", {
                  valueAsNumber: true,
                  required: "Le montant est requis",
                  min: {
                    value: 0.01,
                    message: "Le montant doit être supérieur à zéro",
                  },
                  onBlur: handleAmountBlur,
                })}
              />
              <span
                className={`error-message ${errors.amount ? "visible" : ""}`}
              >
                {errors.amount?.message}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="category">Catégorie:</label>
            <div className="input-container">
              <select id="category" {...register("categoryId")}>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
              <span
                className={`error-message ${errors.categoryId ? "visible" : ""}`}
              >
                {errors.categoryId?.message}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <div className="input-container">
              <input
                type="date"
                id="date"
                {...register("date", {
                  required: "La date est requise",
                })}
              />
              <span className={`error-message ${errors.date ? "visible" : ""}`}>
                {errors.date?.message}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <div className="input-container">
              <input
                type="text"
                id="description"
                {...register("description", {
                  required: "La description est requise",
                  maxLength: {
                    value: 255,
                    message:
                      "La description ne peut pas dépasser 255 caractères",
                  },
                })}
              />
              <span
                className={`error-message ${errors.description ? "visible" : ""}`}
              >
                {errors.description?.message}
              </span>
            </div>
          </div>
          <div className="actions">
            <button
              className={isSubmitting ? "disabled" : ""}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Modification..." : "Modification"}
            </button>
            <button
              className={isSubmitting ? "disabled" : ""}
              type="button"
              onClick={() => onClose()}
              disabled={isSubmitting}
            >
              Annuler
            </button>
          </div>
          <span
            className={`error-message-global ${errors.root?.serverError ? "visible" : ""}`}
          >
            {errors.root?.serverError?.message}
          </span>
        </form>
      </Modal>
    </>
  );
};

export default ModifyExpenseModal;
