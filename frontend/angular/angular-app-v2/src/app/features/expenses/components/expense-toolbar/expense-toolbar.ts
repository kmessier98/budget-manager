import { Component, EventEmitter, Input, Output, computed, inject, input } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Filters } from '../../models/expense/expense';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../categories/services/category-service';
import { ExpenseFormModal } from '../expense-form-modal/expense-form-modal';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ExpenseService } from '../../services/expense-service';

@Component({
  selector: 'app-expense-toolbar',
  imports: [SelectModule, FormsModule, ExpenseFormModal, ToastModule],
  templateUrl: './expense-toolbar.html',
  styleUrl: './expense-toolbar.scss',
})
export class ExpenseToolbar {
  private readonly categoryService = inject(CategoryService);
  private _messageService = inject(MessageService);

  private readonly START_YEAR = 1900;
  private readonly CURRENT_YEAR = new Date().getFullYear();

  protected readonly expenseService = inject(ExpenseService);
  protected readonly months = [
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
  protected years = [{ value: this.CURRENT_YEAR.toString(), label: this.CURRENT_YEAR.toString() }];
  protected categories = computed(() => {
    const categories = this.categoryService.categories();
    return [
      { value: '', label: 'Toutes les catégories' },
      ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];
  });
  daysInMonth = computed(() => {
    const month = parseInt(this.expenseService.filters().month);
    const year = parseInt(this.expenseService.filters().year);

    if (!month) return [{ value: '', label: 'Aucun' }];

    const numberOfDays = new Date(year, month, 0).getDate();
    const newDays = [{ value: '', label: 'Aucun' }];

    for (let day = 1; day <= numberOfDays; day++) {
      newDays.push({ value: day.toString(), label: day.toString() });
    }

    return newDays;
  });

  isModalOpen = false;

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
    this.expenseService.filters.update((current) => ({
      ...current,
      year: event.value,
      day: '',
    }));
  };

  handleMonthChange = (event: any) => {
    this.expenseService.filters.update((current) => ({
      ...current,
      month: event.value,
      day: '',
    }));
  };

  handleDayChange = (event: any) => {
    this.expenseService.filters.update((current) => ({
      ...current,
      day: event.value,
    }));
  };

  handleCategoryChange = (event: any) => {
    this.expenseService.filters.update((current) => ({
      ...current,
      categoryId: event.value,
    }));
  };

  handleSavedExpense() {
    this.isModalOpen = false;
    this._messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Dépense ajoutée avec succès',
    });
  }
}
