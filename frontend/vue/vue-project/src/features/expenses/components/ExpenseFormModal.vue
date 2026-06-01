<script setup lang="ts">
import Dialog from 'primevue/dialog'; // Importation du composant PrimeVue

const emit = defineEmits(['close', 'submit']);
</script>

<template>
    <Dialog header="Ajouter une dépense" :visible="true" modal @update:visible="emit('close')">
        <!--
        Contenu du formulaire de dépense (champs, boutons, etc.)
        Par exemple :
     
            <!-- Champs du formulaire -->
        <form @submit.prevent="emit('submit', /* données du formulaire (formData) */)">
            <button type="submit">Enregistrer</button>
            <button type="button" @click="emit('close')">Annuler</button>
        </form>

    </Dialog>
</template>

<style lang="scss" scoped></style>