<script setup lang="ts">
import Dialog from 'primevue/dialog'; // Importation du composant PrimeVue
import type { Expense, ExpenseFormValues } from '../models/expense/expense';
import { useCategoryStore } from '../../categories/stores/category';
import { useExpenseStore } from '../stores/expense';
import { computed, reactive } from 'vue';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import Form, { type FormSubmitEvent } from '@primevue/forms/Form';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useExpenseApi } from '../composables/useExpenseApi';
import { storeToRefs } from 'pinia';

const props = defineProps<{ expenseToEdit: Expense | null; }>();
const emit = defineEmits(['close', 'submit']);

const toast = useToast();
const categoryStore = useCategoryStore();
const expenseStore = useExpenseStore();
const { fetchExpenses } = expenseStore;
const { filters, loading: isFetching, error: fetchError } = storeToRefs(expenseStore);
const { addExpense, updateExpense, error: submitError, loading: isSubmitting } = useExpenseApi();


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
        const year = filters.value.year;
        const day = filters.value.day
            ? String(filters.value.day).padStart(2, '0')
            : '01';
        const month = filters.value.month
            ? String(filters.value.month).padStart(2, '0')
            : '01';
        return `${year}-${month}-${day}`;
    }
});
const categoryId = computed(() => {
    if (isEditMode.value) {
        return props.expenseToEdit!.category.id;
    } else {
        let defaultCategoryId = categories.value.find(
            (cat) => cat.value === filters.value.categoryId,
        )?.value;
        if (!defaultCategoryId) {
            defaultCategoryId = categories.value[0]!.value;
        }
        return defaultCategoryId;
    }
});
const form = reactive<ExpenseFormValues>({
    id: isEditMode.value ? props.expenseToEdit!.id : undefined,
    amount: isEditMode.value ? props.expenseToEdit!.amount : 0,
    categoryId: categoryId.value,
    date: date.value!,
    description: isEditMode.value ? props.expenseToEdit!.description : '',
});
const schema = z.object({
    amount: z.number().positive({ message: 'Le montant doit être supérieur à zéro.' }),
    categoryId: z.string().min(1, { message: 'La catégorie est requise.' }),
    date: z.string().min(1, { message: 'La date est requise.' }),
    description: z.string()
        .min(1, { message: 'La description est requise.' })
        .max(255, { message: 'La description ne peut pas dépasser 255 caractères.' }),
});
const resolver = zodResolver(schema);



async function handleFormSubmit(e: FormSubmitEvent) {
    if (!e.valid) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez corriger les erreurs du formulaire.', life: 3000 });
        return;
    }

    const formValues = e.values as ExpenseFormValues;

    if (isEditMode.value) {
        await handleUpdateExpense({
            ...formValues,
            id: props.expenseToEdit!.id,
        });
    } else {
        await handleAddExpense(formValues);
    }
}

async function handleFetchExpenses() {
    try {
        await fetchExpenses(filters.value);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors du chargement des dépenses.', life: 3000 });
    }
}

async function handleAddExpense(formValues: ExpenseFormValues) {
    try {
        const response = await addExpense(formValues);
        await handleFetchExpenses();
        emit('submit');
    } catch (err) {
        console.error('Error adding expense:', err);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'ajout de la dépense.', life: 3000 });
    }
}

async function handleUpdateExpense(formValues: ExpenseFormValues) {
    try {
        const response = await updateExpense(formValues.id!, formValues);
        await handleFetchExpenses();
        emit('submit');
    } catch (err) {
        console.error('Error updating expense:', err);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la mise à jour de la dépense.', life: 3000 });
    }
}



</script>

<template>
    <Dialog :header="modalTitle" :visible="true" modal @update:visible="emit('close')" class="expense-dialog"
        :style="{ width: '500px', 'max-width': '90%' }">

        <Form v-slot="$form" :initialValues="form" :resolver="resolver" @submit="handleFormSubmit"
            class="expense-form-modal">
            <div class="form-group">
                <label for="amount">Montant ($):</label>
                <div class="input-container">
                    <InputNumber type="number" id="amount" name="amount" :min="0" />
                    <Message v-if="$form.amount?.invalid" name="amount" severity="error" variant="simple">
                        {{ $form.amount?.error.message }}
                    </Message>
                </div>
            </div>
            <div class="form-group">
                <label for="category">Catégorie:</label>
                <div class="input-container">
                    <Select :options="categories" name="categoryId" id="categoryId" optionLabel="label"
                        optionValue="value" class="select"></Select>
                    <Message v-if="$form.categoryId?.invalid" name="categoryId" severity="error" variant="simple">
                        {{ $form.categoryId?.error.message }}
                    </Message>
                </div>
            </div>
            <div class="form-group">
                <label for="date">Date:</label>
                <div class="input-container">
                    <InputText type="date" name="date" id="date" />
                    <Message v-if="$form.date?.invalid" name="date" severity="error" variant="simple">
                        {{ $form.date?.error.message }}
                    </Message>

                </div>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <div class="input-container">
                    <InputText name="description" id="description" />
                    <Message v-if="$form.description?.invalid" name="description" severity="error" variant="simple">
                        {{ $form.description?.error.message }}
                    </Message>
                </div>
            </div>

            <div class="actions">
                <Button type="submit" :loading="isSubmitting || isFetching">{{ submitButtonLabel }}</Button>
                <Button type="button" @click="emit('close')">Annuler</Button>
            </div>

            <span v-if="submitError || fetchError" class="error-message-global visible">{{ submitError || fetchError
            }}</span>
        </Form>
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