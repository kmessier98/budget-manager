import {
  Component,
  computed,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../categories/services/category-service';
import { SelectModule } from 'primeng/select';
import { ExpenseService } from '../../services/expense-service';
import { Expense, ExpenseFormValues, Filters } from '../../models/expense/expense';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-expense-form-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './expense-form-modal.html',
  styleUrl: './expense-form-modal.scss',
})
export class ExpenseFormModal {
  categoryId = input<string>('');
  date = input<string>('');
  expenseToEdit = input<Expense | null>(null);
  filters = input<Filters>({
    year: '',
    month: '',
    day: '',
    categoryId: '',
  });
  @Output() onClose = new EventEmitter<void>();
  @Output() onExpenseSaved = new EventEmitter<void>();

  private _fb = inject(FormBuilder);
  private _categoryService = inject(CategoryService);
  private _destroyRef = inject(DestroyRef);
  private _messageService = inject(MessageService);

  protected readonly expenseForm = this._fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: ['', Validators.required],
    date: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(255)]],
  });

  protected readonly expenseService = inject(ExpenseService);

  categories = computed(() => {
    const categories = this._categoryService.categories();
    return categories.map((category) => ({ value: category.id, label: category.name }));
  });
  isEditMode = computed(() => this.expenseToEdit() !== null);
  modalTitle = computed(() => (this.isEditMode() ? 'Modifier la dépense' : 'Ajouter une dépense'));
  submitButtonLabel = computed(() => (this.isEditMode() ? 'Modifier' : 'Enregistrer'));

  constructor() {
    // Explication : Reactive Forms ne surveille pas les variables d'entrée (qu'elles soient des signaux ou des variables normales).
    // Le formulaire s'initialise une seule fois au démarrage avec les valeurs par défaut du composant (généralement vides).
    // Cet effect() [ou un ngOnChanges / setter si c'était une variable normale] sert de passerelle obligatoire
    // pour écouter l'arrivée des données et forcer la mise à jour des champs internes du formulaire via patchValue().
    //
    // Note d'architecture : L'équipe d'Angular travaille sur une nouvelle API ("Signal Forms")
    // qui permettra aux formulaires de réagir automatiquement, mais elle est encore récente/expérimentale.
    effect(() => {
      const expense = this.expenseToEdit();

      if (expense) {
        // --- MODE MODIFICATION ---

        const date = expense.date.split('T')[0];
        this.expenseForm.patchValue({
          amount: expense.amount,
          categoryId: expense.category.id,
          date: date,
          description: expense.description,
        });
      } else {
        // --- MODE AJOUT ---

        // Il est possible de sélectionné "toutes les catégories" dans le toolbar.
        // Si c'est le cas, on sélectionne par défaut le premier élément de la liste.
        // Sinon, on prend la catégorie sélectionnée dans le toolbar.
        let defaultCategoryId = this.categories().find(
          (cat) => cat.value === this.categoryId(),
        )?.value;
        if (!defaultCategoryId) {
          defaultCategoryId = this.categories()[0].value;
        }

        this.expenseForm.patchValue({
          amount: 0,
          categoryId: defaultCategoryId,
          date: this.date(),
          description: '',
        });
      }
    });
  }

  get amountControl() {
    return this.expenseForm.get('amount');
  }

  get categoryIdControl() {
    return this.expenseForm.get('categoryId');
  }

  get dateControl() {
    return this.expenseForm.get('date');
  }

  get descriptionControl() {
    return this.expenseForm.get('description');
  }

  handleFormSubmit() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const formValues = this.expenseForm.value as ExpenseFormValues;

    if (this.isEditMode()) {
      this.handleUpdateExpense(formValues);
    } else {
      this.handleAddExpense(formValues);
    }
  }

  handleAddExpense(formValues: ExpenseFormValues) {
    this.expenseService
      .addExpense(formValues, this.filters())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.onExpenseSaved.emit();
        },
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Une erreur est survenue lors de l'ajout de la dépense",
          });
        },
      });
  }

  handleUpdateExpense(formValues: ExpenseFormValues) {
    this.expenseService
      .updateExpense(this.expenseToEdit()!.id, formValues, this.filters())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.onExpenseSaved.emit();
        },
        error: (err) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la modification de la dépense',
          });
        },
      });
  }
}
