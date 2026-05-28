import { Component, computed, inject } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-expense-total-amount',
  imports: [],
  templateUrl: './expense-total-amount.html',
  styleUrl: './expense-total-amount.scss',
})
export class ExpenseTotalAmount {
  private readonly expenseService = inject(ExpenseService);

  private readonly expenseSummary = computed(() => {
    return this.expenseService.expenses()?.summary;
  });

  private readonly formatedAmount = computed(() => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(this.expenseSummary()?.totalAmount ?? 0);
  });

  protected readonly formatedTotalAmount = computed(() => {
    const summary = this.expenseSummary();
    const amountStr = this.formatedAmount();

    const date = new Date(
      summary?.year ? parseInt(summary?.year) : 0,
      summary?.month ? parseInt(summary?.month) - 1 : 0,
      summary?.day ? parseInt(summary?.day) : 1,
    );

    if (summary?.day) {
      return `Total du ${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()} : ${amountStr}`;
    } else if (summary?.month) {
      if (summary?.month == '4' || summary?.month == '8' || summary?.month == '10') {
        return `Total du mois d'${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()} : ${amountStr}`;
      }
      return `Total du mois de ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()} : ${amountStr}`;
    }

    return `Total de l'année ${date.getFullYear()} : ${amountStr}`;
  });
}
