import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ExpenseFormValues } from '../models/expense/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private _http = inject(HttpClient);

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  addExpense(expense: ExpenseFormValues): Observable<any> {
    this._loading.set(true);

    return this._http.post('https://localhost:7208/api/transaction', expense).pipe(
      catchError((err) => {
        this._error.set('Failed to add expense');
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false)),
    );
  }
}
