import { Component } from '@angular/core';
import { ExpenseToolbar } from '../../components/expense-toolbar/expense-toolbar';
import { ExpenseTotalAmount } from '../../components/expense-total-amount/expense-total-amount';
import { ExpenseTable } from '../../components/expense-table/expense-table';
import { ExpenseChart } from '../../components/expense-chart/expense-chart';

@Component({
  selector: 'app-expense-manager',
  imports: [ExpenseToolbar, ExpenseTotalAmount, ExpenseTable, ExpenseChart],
  templateUrl: './expense-manager.html',
  styleUrl: './expense-manager.scss',
})
export class ExpenseManager {
  avatar = '/assets/user-avatar.png';
}
