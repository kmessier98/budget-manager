# Budget Manager

Application de gestion de budget développée avec React, TypeScript et Redux Toolkit. Elle permet de gérer des dépenses, visualiser les montants globaux et suivre les catégories via une interface simple et moderne.

## Présentation

Cette application est une version front-end d'un gestionnaire de budget orientée vers l'expérience utilisateur et la gestion des données côté client. Elle permet :

- Ajouter, modifier et supprimer des dépenses
- Suivre le total des dépenses
- Filtrer et visualiser les données dans un tableau
- Afficher des statistiques sous forme de graphique
- Gérer les catégories et les routes de navigation

## Technologies utilisées

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM

### State management & data fetching

- Redux Toolkit
- React Redux
- RTK Query (via Redux Toolkit Query)

### UI / design

- Bootstrap 5
- Sass
- Font Awesome
- React Hot Toast

### Tables / graphiques / formulaires

- @tanstack/react-table
- Recharts
- React Hook Form

### Outils de développement

- ESLint
- TypeScript ESLint
- Vite plugin React

## Prérequis

Avant de lancer le projet, vérifiez que vous avez installé :

- Node.js (version recommandée : 18 ou plus)
- npm

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

Ensuite, ouvrez l'URL affichée dans le terminal par Vite (généralement http://localhost:5173).

## Scripts disponibles

```bash
npm run dev      # démarre le serveur de développement
npm run build    # génère le build de production
npm run lint     # vérifie le code avec ESLint
npm run preview  # prévisualise le build construit
```

## Structure du projet

```text
src/
├── api/                # API slices et logique RTK Query
├── app/                # store Redux
├── assets/             # ressources visuelles du projet
├── components/         # composants réutilisables (tableau, navbar, chart, etc.)
├── models/             # types et interfaces
├── Modals/             # modales d'ajout / modification
├── pages/              # pages de l'application
├── services/           # services de catégories
├── App.tsx             # composant principal
├── router.tsx          # configuration des routes
├── main.tsx            # point d'entrée
└── index.scss          # styles globaux
```

## Remarque

Ce projet utilise une architecture frontend moderne avec gestion centralisée de l'état et récupération de données via RTK Query, ce qui le rend bien adapté à une application de gestion de budget évolutive.
