import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ExpenseFormValues } from '../models/expense/expense';
import { ApiService } from '../../../services/api-service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private _apiService = inject(ApiService);

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  addExpense(expense: ExpenseFormValues): Observable<any> {
    this._loading.set(true);

    return this._apiService.create('transaction', expense).pipe(
      catchError((err) => {
        this._error.set('Failed to add expense');
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false)),
    );
  }
}
