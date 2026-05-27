import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Category } from './models/category/category';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  private _categories = signal<Category[]>([]);
  private _loading = signal<boolean>(false);

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();

  fetchCategories() {
    this._loading.set(true);

    this.http
      .get<Category[]>('https://localhost:7208/api/category')
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (categories) => {
          console.log('Fetched categories:', categories); // Debug: affiche les catégories reçues de l'API
          this._categories.set(categories);
        },
        error: (err) => {
          console.log('Failed to fetch categories', err);
        },
      });
  }
}
