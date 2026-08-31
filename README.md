# Budget Manager App

Application de gestion de budget avec un backend ASP.NET Core et plusieurs implémentations du frontend.

## Technologies

- Backend : ASP.NET Core / .NET
- Frontend : React, Vue.js et Angular
- Base de données : SQL Server

## Démarrer le backend

1. Ouvrir `backend/BudgetManager - V3/BudgetManager.slnx` avec **Visual Studio**.
2. Définir `BudgetManager.API` comme projet de démarrage.
3. Lancer le projet avec le profil `https`.

L'API est disponible en développement sur `https://localhost:7208` (ou `http://localhost:5064`).

## Démarrer un frontend

Choisir une version dans `frontend/` :

- React : `frontend/react/`
- Vue.js : `frontend/vue/`
- Angular : `frontend/angular/`

Dans le dossier du projet choisi, installer les dépendances puis lancer l'application :

```bash
npm install
```

Pour React et Vue.js :

```bash
npm run dev
```

Pour Angular :

```bash
npm start
```

Chaque technologie contient plusieurs versions de l'application, illustrant différentes approches de gestion d'état et d'interface.
