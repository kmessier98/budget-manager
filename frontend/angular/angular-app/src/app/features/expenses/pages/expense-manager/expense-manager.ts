import { Component, computed, signal, WritableSignal } from '@angular/core';
import { ExpenseToolbar } from '../../components/expense-toolbar/expense-toolbar';
import { ExpenseTotalAmount } from '../../components/expense-total-amount/expense-total-amount';
import { ExpenseTable } from '../../components/expense-table/expense-table';
import { ExpenseChart } from '../../components/expense-chart/expense-chart';
import { ButtonModule } from 'primeng/button';
import { Filters } from '../../models/expense/expense';

@Component({
  selector: 'app-expense-manager',
  imports: [ExpenseToolbar, ExpenseTotalAmount, ExpenseTable, ExpenseChart, ButtonModule],
  templateUrl: './expense-manager.html',
  styleUrl: './expense-manager.scss',
})
export class ExpenseManager {
  avatar = '/assets/user-avatar.png';
  filters: WritableSignal<Filters> = signal({
    year: new Date().getFullYear().toString(),
    month: new Date().getMonth().toString(),
    day: new Date().getDay().toString(),
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

  onFiltersChange = (filters: Filters) => {
    this.filters.set(filters);
  };
}
