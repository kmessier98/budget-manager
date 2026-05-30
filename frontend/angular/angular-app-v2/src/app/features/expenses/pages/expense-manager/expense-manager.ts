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

  ngOnInit() {
    this.categoryService.fetchCategories();
  }
}
