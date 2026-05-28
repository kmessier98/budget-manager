import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Category } from '../models/category/category';
import { finalize } from 'rxjs';
import { ApiService } from '../../../services/api-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _apiService = inject(ApiService);

  private _categories = signal<Category[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  fetchCategories() {
    this._loading.set(true);

    this._apiService
      .getAll<Category>('category')
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (categories) => {
          console.log('Fetched categories:', categories); // Debug: affiche les catégories reçues de l'API
          this._categories.set(categories);
        },
        error: (err) => {
          console.log('Failed to fetch categories', err);
          this._error.set('Failed to fetch categories');
        },
      });
  }
}
