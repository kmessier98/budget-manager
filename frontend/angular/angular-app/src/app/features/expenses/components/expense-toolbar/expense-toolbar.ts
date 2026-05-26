import { Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Filters } from '../../models/expense/expense';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-toolbar',
  imports: [SelectModule, Button, FormsModule],
  templateUrl: './expense-toolbar.html',
  styleUrl: './expense-toolbar.scss',
})
export class ExpenseToolbar {
  @Input() filters: Filters = {
    year: '',
    month: '',
    day: '',
    categoryId: '',
  };
  @Input() daysInMonth: Signal<{ value: string; label: string }[]> = signal([]);
  @Input() categories: { value: string; label: string }[] = [];
  @Output() onFiltersChange = new EventEmitter<Filters>();
  @Output() onAddExpenseSuccess = new EventEmitter<void>();

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

  ngOnInit() {
    this.initYears();
    console.log('filters in toolbar:', this.filters);
  }

  initYears() {
    for (let year = this.CURRENT_YEAR - 1; year >= this.START_YEAR; year--) {
      this.years.push({
        value: year.toString(),
        label: year.toString(),
      });
    }
  }

  handleYearChange = () => {
    this.filters.day = '';
    this.onFiltersChange.emit({
      ...this.filters,
    });
  };

  handleMonthChange = () => {
    this.filters.day = '';
    this.onFiltersChange.emit({
      ...this.filters,
    });
  };

  handleDayChange = () => {
    this.onFiltersChange.emit({
      ...this.filters,
    });
  };

  handleCategoryChange = () => {
    this.onFiltersChange.emit({
      ...this.filters,
    });
  };
}
