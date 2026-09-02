# Budget Manager - frontend React

Application web de gestion des depenses. Cette version est le frontend React
du projet Budget Manager. Elle permet de consulter et de gerer les depenses
depuis une interface avec filtres, tableau pagine, resume des montants et
graphique par categorie.

## Fonctionnalites

- afficher les depenses selon l'annee, le mois, le jour et la categorie ;
- consulter le total et le resume des montants ;
- visualiser la repartition des depenses par categorie ;
- ajouter, modifier et supprimer une depense ;
- parcourir les resultats avec une pagination ;
- afficher les etats de chargement et les notifications de succes ou d'erreur.

## Technologies utilisees

### Application

- **React 19** et **React DOM** : construction de l'interface ;
- **TypeScript** : typage du code ;
- **Vite** : serveur de developpement et build de production ;
- **Sass** : styles des composants et des pages ;
- **Bootstrap 5** : composants et styles utilitaires ;
- **React Router DOM 7** : routage de l'application.

### Composants et experience utilisateur

- **React Hook Form** : gestion des formulaires d'ajout et de modification ;
- **TanStack React Table** : tableau des depenses et pagination ;
- **Recharts** : graphique de repartition par categorie ;
- **Font Awesome** : icones d'action ;
- **React Hot Toast** : notifications ;
- **React Spinners** : indicateurs de chargement.

### Qualite et outillage

- **ESLint** avec les plugins React Hooks et React Refresh : controle du code ;
- **TypeScript ESLint** : regles ESLint pour TypeScript.

## Prerequis

- Node.js et npm ;
- l'API backend Budget Manager demarree et accessible a l'adresse :
  `https://localhost:7208`.

Les appels a l'API sont definis dans `src/services/expenseService.ts` et
`src/services/categoryService.ts`.

## Installation et demarrage

Depuis ce dossier :

```bash
npm install
npm run dev
```

Ouvrez ensuite l'adresse affichee par Vite dans le navigateur, generalement
`http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev      # lance le serveur de developpement Vite
npm run build    # verifie TypeScript puis genere le build de production
npm run lint     # lance ESLint
npm run preview  # sert localement le build genere
```

## Structure principale

```text
src/
├── components/   # barre d'outils, tableau, graphique, navigation et footer
├── Modals/       # formulaires d'ajout et de modification
├── models/       # types TypeScript des depenses, categories et pagination
├── pages/        # pages de l'application
└── services/     # appels HTTP vers l'API backend
```

## Routes

- `/` : gestionnaire de depenses ;
- `/expense-manager` : gestionnaire de depenses.
