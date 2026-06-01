<script setup lang="ts">
import Dialog from 'primevue/dialog'; // Importation du composant PrimeVue
import type { Expense, ExpenseFormValues } from '../models/expense/expense';
import { useCategoryStore } from '../../../stores/category';
import { useExpenseStore } from '../../../stores/expense';
import { computed } from 'vue';
import Select from 'primevue/select';

const props = defineProps<{ expenseToEdit: Expense | null; }>();
const emit = defineEmits(['close', 'submit']);

const categoryStore = useCategoryStore();
const expenseStore = useExpenseStore();
const { filters } = expenseStore;

/*
  protected readonly expenseForm = this._fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: ['', Validators.required],
    date: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(255)]],
  });
  */

const categories = computed(() => {
    const categories = categoryStore.categories;
    return categories.map((category) => ({ value: category.id, label: category.name }));
});
const isEditMode = computed(() => props.expenseToEdit !== null);
const modalTitle = computed(() => isEditMode.value ? "Modifier la dépense" : "Ajouter une dépense");
const submitButtonLabel = computed(() => isEditMode.value ? "Enregistrer les modifications" : "Ajouter la dépense");
const date = computed(() => {
    if (isEditMode.value) {
        return props.expenseToEdit!.date.split('T')[0];
    } else {
        const year = filters.year;
        const day = filters.day
            ? String(filters.day).padStart(2, '0')
            : '01';
        const month = filters.month
            ? String(filters.month).padStart(2, '0')
            : '01';
        return `${year}-${month}-${day}`;
    }
});
const categoryId = computed(() => {
    if (isEditMode.value) {
        return props.expenseToEdit!.category.id;
    } else {
        let defaultCategoryId = categories.value.find(
            (cat) => cat.value === filters.categoryId,
        )?.value;
        if (!defaultCategoryId) {
            defaultCategoryId = categories.value[0]!.value;
        }
        return defaultCategoryId;
    }
});

/*  
constructor() {
    // Explication : Reactive Forms ne surveille pas les variables d'entrée (qu'elles soient des signaux ou des variables normales).
    // Le formulaire s'initialise une seule fois au démarrage avec les valeurs par défaut du composant (généralement vides).
    // Cet effect() [ou un ngOnChanges / setter si c'était une variable normale] sert de passerelle obligatoire
    // pour écouter l'arrivée des données et forcer la mise à jour des champs internes du formulaire via patchValue().
    //
    // Note d'architecture : L'équipe d'Angular travaille sur une nouvelle API ("Signal Forms")
    // qui permettra aux formulaires de réagir automatiquement, mais elle est encore récente/expérimentale.
    effect(() => {
      const expense = this.expenseToEdit();

      if (expense) {
        // --- MODE MODIFICATION ---

        this.expenseForm.patchValue({
          amount: expense.amount,
          categoryId: expense.category.id,
          date: this.date(),
          description: expense.description,
        });
      } else {
        // --- MODE AJOUT ---

        // Il est possible de sélectionné "toutes les catégories" dans le toolbar.
        // Si c'est le cas, on sélectionne par défaut le premier élément de la liste.
        // Sinon, on prend la catégorie sélectionnée dans le toolbar.
        let defaultCategoryId = this.categories().find(
          (cat) => cat.value === this.expenseService.filters().categoryId,
        )?.value;
        if (!defaultCategoryId) {
          defaultCategoryId = this.categories()[0].value;
        }

        this.expenseForm.patchValue({
          amount: 0,
          categoryId: defaultCategoryId,
          date: this.date(),
          description: '',
        });
      }
    });
  }

  get amountControl() {
    return this.expenseForm.get('amount');
  }
*/

/*
  get amountControl() {
    return this.expenseForm.get('amount');
  }

  get categoryIdControl() {
    return this.expenseForm.get('categoryId');
  }

  get dateControl() {
    return this.expenseForm.get('date');
  }

  get descriptionControl() {
    return this.expenseForm.get('description');
  }
    */

function handleFormSubmit(formValues: ExpenseFormValues) {
    /*
 if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const formValues = this.expenseForm.value as ExpenseFormValues;

    */

    if (isEditMode.value) {
        handleUpdateExpense(formValues);
    } else {
        handleAddExpense(formValues);
    }
}

function handleAddExpense(formValues: ExpenseFormValues) {

}

function handleUpdateExpense(formValues: ExpenseFormValues) {

}


</script>

<template>
    <Dialog :header="modalTitle" :visible="true" modal @update:visible="emit('close')" class="expense-dialog"
        :style="{ width: '500px', 'max-width': '90%' }">
        <!--
        Contenu du formulaire de dépense (champs, boutons, etc.)
        Par exemple :
     
            <!-- Champs du formulaire -->
        <!--
        <form @submit.prevent="emit('submit', /* données du formulaire (formData) */)">
            <button type="submit">Enregistrer</button>
            <button type="button" @click="emit('close')">Annuler</button>
        </form>
        -->


        <form class="expense-form-modal">
            <div class="form-group">
                <label for="amount">Montant ($):</label>
                <div class="input-container">
                    <input type="number" id="amount" step="0.01" min="0" formControlName="amount" />
                    <!--
                    @if (amountControl?.invalid && (amountControl?.dirty || amountControl?.touched)) {
                    <span class="error-message visible">
                        @if (amountControl?.errors?.['required']) {
                        Le montant est requis.
                        } @else if (amountControl?.errors?.['min']) {
                        Le montant doit être supérieur à zéro.
                        }
                    </span>
                    }
                    -->
                </div>
            </div>
            <div class="form-group">
                <label for="category">Catégorie:</label>
                <div class="input-container">
                    <Select v-model="categoryId" :options="categories" optionLabel="label" optionValue="value"
                        class="select"></Select>
                    <!--
                    <p-select [options]="categories()" optionValue="value" optionLabel="label" class="select"
                        formControlName="categoryId" appendTo="body" />
                    @if (
                    categoryIdControl?.invalid && (categoryIdControl?.dirty || categoryIdControl?.touched)
                    ) {
                    <span class="error-message visible">
                        @if (categoryIdControl?.errors?.['required']) {
                        La catégorie est requise.
                        }
                    </span>
                    }
                    -->
                </div>
            </div>
            <div class="form-group">
                <label for="date">Date:</label>
                <div class="input-container">
                    <input v-model="date" type="date" id="date" formControlName="date" />
                    <!--
                    @if (dateControl?.invalid && (dateControl?.dirty || dateControl?.touched)) {
                    <span class="error-message visible">
                        @if (dateControl?.errors?.['required']) {
                        La date est requise.
                        }
                    </span>
                    }
                    -->
                </div>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <div class="input-container">
                    <input type="text" id="description" formControlName="description" />
                    <!--
                    @if (
                    descriptionControl?.invalid && (descriptionControl?.dirty || descriptionControl?.touched)
                    ) {
                    <span class="error-message visible">
                        @if (descriptionControl?.errors?.['required']) {
                        La description est requise.
                        } @else if (descriptionControl?.errors?.['maxLength']) {
                        La description ne peut pas dépasser 255 caractères.
                        }
                    </span>
                    }
                    -->
                </div>
            </div>

            <div class="actions">
                <!---
                <p-button type="submit" [loading]="expenseService.loading()">{{
                    submitButtonLabel
                }}</p-button>
                -->
                <button type="button" @click="emit('close')">Annuler</button>
            </div>
            <!--
            @if (expenseService.error()) {
            <span class="error-message-global visible">
                {{ expenseService.error() }}
            </span>
            }
            -->
        </form>

    </Dialog>
</template>

<!-- 1. BLOC GLOBAL (SANS SCOPED) : Dédié à la structure externe de PrimeVue -->
<style lang="scss">
@use '../../../assets/scss/variables' as *;

.p-dialog-mask {
    .p-dialog.expense-dialog {
        .p-dialog-header {
            background-color: $color-1 !important;
            padding: 10px 10px 10px 20px !important;

            .p-dialog-title {
                font-size: 1.5rem !important;
                color: #fff !important;
            }

            .p-dialog-close-button {
                background: none !important;
                border: none !important;
                color: #fff !important;
                box-shadow: none !important; // Enlève l'effet d'ombre au clic de PrimeVue

                &:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                }

                svg {
                    color: #fff !important;
                }
            }
        }

        .p-dialog-content {
            background-color: #fff !important;
            padding: 15px 20px !important;
        }
    }
}
</style>

<!-- 2. BLOC SCOPED : Dédié au style interne du formulaire -->
<style lang="scss" scoped>
@use '../../../assets/scss/variables' as *;

.expense-form-modal {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 10px;

    .form-group {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 16px;

        label {
            color: $color-1;
            font-size: 1rem;
            font-weight: 400;
            width: 90px;
            padding-top: 5px;
        }

        .input-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        input {
            border-radius: 4px;
            width: 100%;
            padding: 4px 0;
            padding-left: 8px;
        }

        .p-select {
            border: 2px solid $color-1;
            border-radius: 4px;
            width: 100%;

            .p-select-label {
                padding: 4px 8px;
            }
        }
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;

        button {
            background-color: $color-1;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            margin-top: auto;

            &:hover {
                background-color: $background-color-3;
            }

            &.disabled {
                background-color: #ccc;
                cursor: not-allowed;

                &:hover {
                    background-color: #ccc;
                }
            }
        }

        button[type='button'] {
            background-color: #ccc;
            color: $color-1;
            font-weight: 400;

            &:hover {
                background-color: #bbb;
            }

            &.disabled {
                background-color: #ccc;
                cursor: not-allowed;

                &:hover {
                    background-color: #ccc;
                }
            }
        }
    }

    .error-message {
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
        visibility: hidden;

        &.visible {
            visibility: visible;
        }
    }

    .error-message-global {
        color: #dc3545;
        font-size: 14px;
        margin-top: 8px;
        text-align: left;
        visibility: hidden;

        &.visible {
            visibility: visible;
        }
    }
}
</style>