import { Routes } from '@angular/router';
import { ExpenseManager } from './features/expenses/pages/expense-manager/expense-manager';

export const routes: Routes = [
  { path: '', component: ExpenseManager },
  { path: '**', redirectTo: '' },
];
