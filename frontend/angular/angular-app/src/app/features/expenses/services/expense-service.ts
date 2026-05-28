import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ExpenseFormValues, Expense } from '../models/expense/expense';
import { ApiService } from '../../../services/api-service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly apiService = inject(ApiService);

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  addExpense(expense: ExpenseFormValues): Observable<Expense> {
    this._loading.set(true);
    this._error.set(null);

    return this.apiService.create<Expense, ExpenseFormValues>('transaction', expense).pipe(
      catchError((err) => {
        this._error.set('Failed to add expense');
        return throwError(() => err);
      }),
      finalize(() => {
        this._loading.set(false);
      }),
    );
  }
}
