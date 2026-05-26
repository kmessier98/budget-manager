import { Component, computed } from '@angular/core';
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
  filters: Filters = {
    year: new Date().getFullYear().toString(),
    month: new Date().getMonth().toString(),
    day: new Date().getDay().toString(),
    categoryId: '',
  };

  onFiltersChange = (filters: Filters) => {
    this.filters = filters;
    console.log('parent!!!:', this.filters);
  };

  //todo a déplacé dans l'enfant... mais aavnt comprendre comment ma rappelé l'enfant apres un changement de filtre (peut etre que ca ne va pas retoruenr dans lenfant au final)
  //filter devra etre un signal pour qu ewceci marche...
  daysInMonth = computed(() => {
    const month = parseInt(this.filters.month);
    const year = parseInt(this.filters.year);

    if (!month) return [{ value: '', label: 'Aucun' }];

    const numberOfDays = new Date(year, month, 0).getDate();
    const newDays = [{ value: '', label: 'Aucun' }];

    for (let day = 1; day <= numberOfDays; day++) {
      newDays.push({ value: day.toString(), label: day.toString() });
    }
    console.log('days in month:', newDays);
    return newDays;
  });
}
