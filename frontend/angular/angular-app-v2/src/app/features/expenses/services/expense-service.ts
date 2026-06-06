import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
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

  filters: WritableSignal<Filters> = signal({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
    categoryId: '',
    pageNumber: '1',
    pageSize: '10',
  });

  constructor() {
    effect(() => {
      this.fetchExpenses(this.filters());
    });
  }

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
          console.error('Failed to fetch expenses', err);

          if (err.error && typeof err.error === 'object') {
            const serverMessage = err.error.detail || err.error.title || `Erreur ${err.status}`;
            console.error('Server error message:', serverMessage);
            this._error.set(serverMessage);
          } else {
            console.error('Unexpected error format:', err);
            this._error.set(`Impossible de joindre le serveur (Code: ${err.status})`);
          }
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
            this._error.set('Dépense ajoutée, mais impossible de rafraîchir la liste.');
            return throwError(() => err);
          }),
        ),
      ),
      catchError((err) => {
        if (!this._error()) {
          this._error.set("Impossible d'ajouter la dépense.");
        }
        return throwError(() => err);
      }),
      finalize(() => {
        console.log('3. Finalize: setting loading to false');
        this._loading.set(false);
      }),
    );
  }

  updateExpense(
    id: string,
    expense: ExpenseFormValues,
    filters: Filters,
  ): Observable<ExpenseResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.apiService.update<Expense, ExpenseFormValues>('transaction', id, expense).pipe(
      tap((updatedExpense) => {
        console.log('1. Expense updated:', updatedExpense);
      }),
      switchMap(() =>
        this.apiService.get<ExpenseResponse>('transaction', filters).pipe(
          tap((response) => {
            console.log('2. Expense updated, fetching updated expenses:', response);
            this._expenses.set(response);
          }),
          catchError((err) => {
            this._error.set('Dépense modifiée, mais impossible de rafraîchir la liste.');
            return throwError(() => err);
          }),
        ),
      ),
      catchError((err) => {
        if (!this._error()) {
          this._error.set('Impossible de modifier la dépense.');
        }
        return throwError(() => err);
      }),
      finalize(() => {
        console.log('3. Finalize: setting loading to false');
        this._loading.set(false);
      }),
    );
  }

  deleteExpense(id: string, filters: Filters): Observable<ExpenseResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.apiService.delete('transaction', id).pipe(
      tap(() => {
        console.log('1. Expense deleted with id:', id);
      }),
      switchMap(() =>
        this.apiService.get<ExpenseResponse>('transaction', filters).pipe(
          tap((response) => {
            console.log('2. Expense deleted, fetching updated expenses:', response);
            this._expenses.set(response);
          }),
          catchError((err) => {
            this._error.set('Dépense supprimée, mais impossible de rafraîchir la liste.');
            return throwError(() => err);
          }),
        ),
      ),
      catchError((err) => {
        if (!this._error()) {
          this._error.set('Impossible de supprimer la dépense.');
        }
        return throwError(() => err);
      }),
      finalize(() => {
        console.log('3. Finalize: setting loading to false');
        this._loading.set(false);
      }),
    );
  }
}
