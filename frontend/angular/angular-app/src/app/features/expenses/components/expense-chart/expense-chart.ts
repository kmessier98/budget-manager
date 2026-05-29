import { Component, computed, effect, inject, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-expense-chart',
  imports: [],
  templateUrl: './expense-chart.html',
  styleUrl: './expense-chart.scss',
})
export class ExpenseChart {
  private readonly expenseService = inject(ExpenseService);

  protected chartData = signal<any>(null);
  protected chartOptions = signal<any>(null);

  //sera  suremnet initule. on va initer le chart dans le effect
  protected readonly data = computed(() => {
    return this.expenseService.expenses()?.summary?.amountByCategory || [];
  });

  constructor() {
    effect(() => {
      // 1. On extrait TOUJOURS la valeur du computed en premier dans une variable
      // Cela force Angular à enregistrer la dépendance de manière stricte à chaque cycle
      const summary = this.data();

      // 2. On fait nos vérifications sur la variable
      if (summary) {
        console.log('Le computed fonctionne ! Voici le summary :', summary);

        // C'est ici que vous injecterez les données dans votre graphique PrimeNG !
      } else {
        console.log("Le computed est actuellement undefined (en attente de l'API)...");
      }
    });
  }
}
