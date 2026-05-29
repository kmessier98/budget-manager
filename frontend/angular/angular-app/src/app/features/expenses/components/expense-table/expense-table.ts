import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { ExpenseService } from '../../services/expense-service';
import { ButtonModule } from 'primeng/button';
import { Expense } from '../../models/expense/expense';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ExpenseFormModal } from '../expense-form-modal/expense-form-modal';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-expense-table',
  imports: [TableModule, ButtonModule, DatePipe, CurrencyPipe, PaginatorModule, ExpenseFormModal],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.scss',
})
export class ExpenseTable {
  @Output() onPageChange = new EventEmitter<{ pageNumber: number; pageSize: number }>();
  filters = input({
    year: '',
    month: '',
    day: '',
    categoryId: '',
  });

  private readonly expenseService = inject(ExpenseService);
  private _messageService = inject(MessageService);

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

    this.onPageChange.emit({ pageNumber, pageSize });
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

  handleDeleteConfirmation() {
    if (!this.selectedExpense) return;
    //todo faire le delete ici car le modal na pas besoin d e rester ouvert si ya un erreur
    this._messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue lors de la suppression de la dépense',
    });
  }

  handleModalClose() {
    this.isEditModalOpen = false;
    this.isDeleteConfirmationOpen = false;
    this.selectedExpense = null;
  }
}
