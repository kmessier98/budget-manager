import { Component, computed, effect, inject, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-expense-chart',
  imports: [ChartModule],
  templateUrl: './expense-chart.html',
  styleUrl: './expense-chart.scss',
})
export class ExpenseChart {
  private readonly expenseService = inject(ExpenseService);

  protected chartData = signal<any>(null);
  protected chartOptions = signal<any>(null);

  constructor() {
    effect(() => {
      const amountByCategory = this.expenseService.expenses()?.summary.amountByCategory || [];
      console.log('Updating chart data with amountByCategory:', amountByCategory);

      if (amountByCategory.length === 0) {
        this.chartData.set(null);
        this.chartOptions.set(null);
        return;
      }

      const labels = amountByCategory.map(
        (item) => `${item.name} (${this.amountFormatter(item.amount)})`,
      );
      const data = amountByCategory.map((item) => item.amount);

      this.initChart(labels, data);
    });
  }

  initChart(labels: string[], data: number[]) {
    this.chartData.set({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        },
      ],
    });

    this.chartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => ` ${this.amountFormatter(context.raw)}`,
          },
        },
      },
    });
  }

  amountFormatter = (value: number) => {
    const amount = parseFloat(value.toString());
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };
}
