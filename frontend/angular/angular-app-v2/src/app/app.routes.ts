import { Routes } from '@angular/router';
import { ExpenseManager } from './features/expenses/pages/expense-manager/expense-manager';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/expenses/pages/expense-manager/expense-manager').then(
        (m) => m.ExpenseManager,
      ),
  },
  { path: '**', redirectTo: '' },
];
