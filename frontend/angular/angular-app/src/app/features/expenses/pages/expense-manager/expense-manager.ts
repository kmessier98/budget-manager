import { Component } from '@angular/core';
import { ExpenseToolbar } from '../../components/expense-toolbar/expense-toolbar';
import { ExpenseTotalAmount } from '../../components/expense-total-amount/expense-total-amount';
import { ExpenseTable } from '../../components/expense-table/expense-table';
import { ExpenseChart } from '../../components/expense-chart/expense-chart';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-expense-manager',
  imports: [ExpenseToolbar, ExpenseTotalAmount, ExpenseTable, ExpenseChart, ButtonModule],
  templateUrl: './expense-manager.html',
  styleUrl: './expense-manager.scss',
})
export class ExpenseManager {
  avatar = '/assets/user-avatar.png';
}
