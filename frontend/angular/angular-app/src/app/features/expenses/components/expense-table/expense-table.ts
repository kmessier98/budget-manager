import { Component, computed, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ExpenseService } from '../../services/expense-service';
import { ButtonModule } from 'primeng/button';
import { Expense } from '../../models/expense/expense';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-expense-table',
  imports: [TableModule, ButtonModule, DatePipe, CurrencyPipe],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.scss',
})
export class ExpenseTable {
  private readonly expenseService = inject(ExpenseService);

  protected transactions = computed(() => this.expenseService.expenses()?.transactions || []);

  handleEdit(transaction: Expense) {
    console.log('Edit transaction:', transaction);
  }

  handleDelete(transaction: Expense) {
    console.log('Delete transaction:', transaction);
  }
}
