import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { ExpenseFormValues, Expense, ExpenseResponse, Filters } from '../models/expense/expense';
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

  fetchExpenses(filters: Filters): void {
    this._loading.set(true);
    this._error.set(null);

    this.apiService
      .get<ExpenseResponse>('transaction', filters)
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

  addExpense(expense: ExpenseFormValues, filters: Filters): Observable<ExpenseResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.apiService.create<Expense, ExpenseFormValues>('transaction', expense).pipe(
      tap((createdExpense) => {
        console.log('1. Expense created:', createdExpense);
      }),
      switchMap(() =>
        this.apiService.get<ExpenseResponse>('transaction', filters).pipe(
          tap((response) => {
            console.log('2. Expense added, fetching updated expenses:', response);
            this._expenses.set(response);
          }),
          catchError((err) => {
            return throwError(() => err);
          }),
        ),
      ),
      catchError((err) => {
        return throwError(() => err);
      }),
      finalize(() => {
        console.log('3. Finalize: setting loading to false');
        this._loading.set(false);
      }),
    );
  }
}
