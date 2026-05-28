import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ExpenseFormValues, Expense, ExpenseResponse } from '../models/expense/expense';
import { ApiService } from '../../../services/api-service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly apiService = inject(ApiService);

  private _expenses = signal<ExpenseResponse | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly expenses = this._expenses.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  fetchExpenses(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apiService
      .get<ExpenseResponse>('transaction')
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Fetched expenses:', response);
          this._expenses.set(response);
        },
        error: (err) => {
          console.log('Failed to fetch expenses', err);
          this._error.set('Failed to fetch expenses');
        },
      });
  }

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
