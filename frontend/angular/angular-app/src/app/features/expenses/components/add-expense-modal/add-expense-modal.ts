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
  selector: 'app-add-expense-modal',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, SelectModule],
  templateUrl: './add-expense-modal.html',
  styleUrl: './add-expense-modal.scss',
})
export class AddExpenseModal {
  categoryId = input<string>('');
  date = input<string>('');
  filters = input<Filters>({
    year: '',
    month: '',
    day: '',
    categoryId: '',
  });
  @Output() onClose = new EventEmitter<void>();
  @Output() onExpenseAdded = new EventEmitter<void>();

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

  constructor() {
    // Explication : Reactive Forms ne surveille pas les variables d'entrée (qu'elles soient des signaux ou des variables normales).
    // Le formulaire s'initialise une seule fois au démarrage avec les valeurs par défaut du composant (généralement vides).
    // Cet effect() [ou un ngOnChanges / setter si c'était une variable normale] sert de passerelle obligatoire
    // pour écouter l'arrivée des données et forcer la mise à jour des champs internes du formulaire via patchValue().
    //
    // Note d'architecture : L'équipe d'Angular travaille sur une nouvelle API ("Signal Forms")
    // qui permettra aux formulaires de réagir automatiquement, mais elle est encore récente/expérimentale.
    effect(() => {
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
        categoryId: defaultCategoryId,
        date: this.date(),
      });
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

  categories = computed(() => {
    const categories = this._categoryService.categories();
    return categories.map((category) => ({ value: category.id, label: category.name }));
  });

  handleFormSubmit() {
    console.log('Form submitted with values:', this.expenseForm.value);
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }
    const newExpense = this.expenseForm.value as ExpenseFormValues;
    this.expenseService
      .addExpense(newExpense, this.filters())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.onExpenseAdded.emit();
          this._messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Dépense ajoutée avec succès',
          });
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
}
