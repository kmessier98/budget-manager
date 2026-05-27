import { Component, EventEmitter, Input, Output, computed, inject, input } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Filters } from '../../models/expense/expense';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../categories/services/category-service';

@Component({
  selector: 'app-expense-toolbar',
  imports: [SelectModule, FormsModule],
  templateUrl: './expense-toolbar.html',
  styleUrl: './expense-toolbar.scss',
})
export class ExpenseToolbar {
  // ==========================================
  // ARCHITECTURE & FLUX DE DONNÉES :
  // Le HTML utilise [ngModel] et non pas [(ngModel)], du coup on ne peut pas utiliser la syntaxe de liaison bidirectionnelle pour mettre à jour les filtres.
  // La raison pk on fait cela est que les filtres sont gérés dans le composant parent (ExpenseManager) et que ce composant (ExpenseToolbar) est un composant enfant qui reçoit les filtres en entrée et émet des événements de changement de filtres en sortie.
  // Le filtre on le recoit en input et on ne peut pas le modifier directement dans le composant enfant, sinon cela violerait le principe de l'unidirectional data flow d'Angular.
  // Les input() modernes d'Angular (basés sur les signaux) sont conçus pour être strictement en lecture seule à l'intérieur du composant enfant.
  // ==========================================
  filters = input({
    year: '',
    month: '',
    day: '',
    categoryId: '',
  });
  daysInMonth = input<{ value: string; label: string }[]>([]);
  @Output() onFiltersChange = new EventEmitter<Filters>();
  @Output() onAddExpenseSuccess = new EventEmitter<void>();

  private readonly _categoryService = inject(CategoryService);
  private readonly START_YEAR = 1900;
  private readonly CURRENT_YEAR = new Date().getFullYear();
  readonly months = [
    { value: '', label: 'Aucun' },
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];
  years = [{ value: this.CURRENT_YEAR.toString(), label: this.CURRENT_YEAR.toString() }];
  categories = computed(() => {
    const categories = this._categoryService.categories();
    return [
      { value: '', label: 'Toutes les catégories' },
      ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];
  });

  ngOnInit() {
    this.initYears();
  }

  initYears() {
    for (let year = this.CURRENT_YEAR - 1; year >= this.START_YEAR; year--) {
      this.years.push({
        value: year.toString(),
        label: year.toString(),
      });
    }
  }

  handleYearChange = (event: any) => {
    this.onFiltersChange.emit({
      ...this.filters(),
      year: event.value,
      day: '',
    });
  };

  handleMonthChange = (event: any) => {
    this.onFiltersChange.emit({
      ...this.filters(),
      month: event.value,
      day: '',
    });
  };

  handleDayChange = (event: any) => {
    this.onFiltersChange.emit({
      ...this.filters(),
      day: event.value,
    });
  };

  handleCategoryChange = (event: any) => {
    this.onFiltersChange.emit({
      ...this.filters(),
      categoryId: event.value,
    });
  };
}
