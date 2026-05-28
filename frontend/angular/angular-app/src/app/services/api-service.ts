import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll<T>(endpoint: string, params?: Record<string, any>): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`, {
      params: this.buildParams(params),
    });
  }

  getById<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  create<T>(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  update<T>(endpoint: string, id: string | number, data: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  patch<T>(endpoint: string, id: string | number, data: T): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });

    return httpParams;
  }
}
