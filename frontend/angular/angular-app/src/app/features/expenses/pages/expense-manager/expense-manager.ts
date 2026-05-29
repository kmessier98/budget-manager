import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ExpenseToolbar } from '../../components/expense-toolbar/expense-toolbar';
import { ExpenseTotalAmount } from '../../components/expense-total-amount/expense-total-amount';
import { ExpenseTable } from '../../components/expense-table/expense-table';
import { ExpenseChart } from '../../components/expense-chart/expense-chart';
import { ButtonModule } from 'primeng/button';
import { Filters } from '../../models/expense/expense';
import { CategoryService } from '../../../categories/services/category-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-expense-manager',
  imports: [
    ExpenseToolbar,
    ExpenseTotalAmount,
    ExpenseTable,
    ExpenseChart,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './expense-manager.html',
  styleUrl: './expense-manager.scss',
})
export class ExpenseManager {
  protected readonly categoryService = inject(CategoryService);
  protected readonly expenseService = inject(ExpenseService);

  avatar = '/assets/user-avatar.png';
  filters: WritableSignal<Filters> = signal({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    categoryId: '',
  });

  daysInMonth = computed(() => {
    const month = parseInt(this.filters().month);
    const year = parseInt(this.filters().year);

    if (!month) return [{ value: '', label: 'Aucun' }];

    const numberOfDays = new Date(year, month, 0).getDate();
    const newDays = [{ value: '', label: 'Aucun' }];

    for (let day = 1; day <= numberOfDays; day++) {
      newDays.push({ value: day.toString(), label: day.toString() });
    }

    return newDays;
  });

  constructor() {
    effect(() => {
      // Cet effect se déclenche une fois initialement et agit comme un "watch" sur les changements de filtres.
      this.expenseService.fetchExpenses(this.filters());
    });
  }

  ngOnInit() {
    this.categoryService.fetchCategories();
  }

  handleFiltersChange = (filters: Filters) => {
    this.filters.set(filters);
  };

  handlePageChange = ({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }) => {
    this.filters.update((current) => ({
      ...current,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    }));
  };
}
