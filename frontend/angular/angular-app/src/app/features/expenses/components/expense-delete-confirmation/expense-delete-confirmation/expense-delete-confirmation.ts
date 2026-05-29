import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Expense } from '../../../models/expense/expense';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-delete-confirmation',
  imports: [DialogModule, ButtonModule, CurrencyPipe, DatePipe],
  templateUrl: './expense-delete-confirmation.html',
  styleUrl: './expense-delete-confirmation.scss',
})
export class ExpenseDeleteConfirmation {
  expense = input<Expense | null>(null);
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
}
