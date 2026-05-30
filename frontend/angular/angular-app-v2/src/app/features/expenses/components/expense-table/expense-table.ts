import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { ExpenseService } from '../../services/expense-service';
import { ButtonModule } from 'primeng/button';
import { Expense } from '../../models/expense/expense';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ExpenseFormModal } from '../expense-form-modal/expense-form-modal';
import { MessageService } from 'primeng/api';
import { ExpenseDeleteConfirmation } from '../expense-delete-confirmation/expense-delete-confirmation/expense-delete-confirmation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-expense-table',
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    CurrencyPipe,
    PaginatorModule,
    ExpenseFormModal,
    ExpenseDeleteConfirmation,
  ],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.scss',
})
export class ExpenseTable {
  private readonly expenseService = inject(ExpenseService);
  private _messageService = inject(MessageService);
  private _destroyRef = inject(DestroyRef);

  protected transactions = computed(() => this.expenseService.expenses()?.transactions || []);
  protected metadata = computed(() => this.expenseService.expenses()?.metadata);

  protected first = computed(() => {
    const meta = this.metadata();
    if (!meta) return 0;

    // Formule : (PageActuelle - 1) * NombreDitemsParPage
    // Exemple : (Page 2 - 1) * 10 = index 10 (la deuxième page)
    return (meta.pageNumber - 1) * meta.pageSize;
  });

  protected isEditModalOpen = false;
  protected isDeleteConfirmationOpen = false;
  protected selectedExpense: Expense | null = null;

  handlePageChange(event: TablePageEvent) {
    const pageNumber = event.first / event.rows + 1;
    const pageSize = event.rows;

    this.expenseService.filters.update((current) => ({
      ...current,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    }));
  }

  handleEdit(transaction: Expense) {
    this.selectedExpense = transaction;
    this.isEditModalOpen = true;
  }

  handleDelete(transaction: Expense) {
    this.selectedExpense = transaction;
    this.isDeleteConfirmationOpen = true;
  }

  handleSavedExpense() {
    this.isEditModalOpen = false;
    this._messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Dépense modifiée avec succès',
    });
  }

  handleDeletedExpense() {
    if (!this.selectedExpense) {
      this.isDeleteConfirmationOpen = false;
      this._messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la suppression de la dépense',
      });
      return;
    }

    this.expenseService
      .deleteExpense(this.selectedExpense.id, this.expenseService.filters())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isDeleteConfirmationOpen = false;
          this._messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Dépense supprimée avec succès',
          });
        },
        error: (err) => {
          this.isDeleteConfirmationOpen = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la suppression de la dépense',
          });
        },
      });
  }

  handleModalClose() {
    this.isEditModalOpen = false;
    this.isDeleteConfirmationOpen = false;
    this.selectedExpense = null;
  }
}
