import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { ExpenseService } from '../../services/expense-service';
import { ButtonModule } from 'primeng/button';
import { Expense } from '../../models/expense/expense';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-expense-table',
  imports: [TableModule, ButtonModule, DatePipe, CurrencyPipe, PaginatorModule],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.scss',
})
export class ExpenseTable {
  @Output() onPageChange = new EventEmitter<{ pageNumber: number; pageSize: number }>();
  private readonly expenseService = inject(ExpenseService);

  protected transactions = computed(() => this.expenseService.expenses()?.transactions || []);
  protected metadata = computed(() => this.expenseService.expenses()?.metadata);

  protected first = computed(() => {
    const meta = this.metadata();
    if (!meta) return 0;

    // Formule : (PageActuelle - 1) * NombreDitemsParPage
    // Exemple : (Page 2 - 1) * 10 = index 10 (la deuxième page)
    return (meta.pageNumber - 1) * meta.pageSize;
  });

  handlePageChange(event: TablePageEvent) {
    const pageNumber = event.first / event.rows + 1;
    const pageSize = event.rows;

    this.onPageChange.emit({ pageNumber, pageSize });
  }

  handleEdit(transaction: Expense) {
    console.log('Edit transaction:', transaction);
  }

  handleDelete(transaction: Expense) {
    console.log('Delete transaction:', transaction);
  }
}
