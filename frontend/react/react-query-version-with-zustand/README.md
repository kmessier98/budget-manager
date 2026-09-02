# Budget Manager

Application web de gestion des dépenses. Cette version est le frontend React du projet et communique avec une API backend locale pour charger et modifier les transactions et les catégories.

## Fonctionnalités

- Affichage paginé des dépenses
- Filtrage des transactions par période, catégorie et texte
- Ajout d’une dépense
- Modification et suppression d’une dépense
- Affichage du montant total
- Visualisation des dépenses dans un graphique
- Notifications lors des opérations réussies ou échouées

## Technologies utilisées

### Application

- **React 19** : création de l’interface utilisateur
- **TypeScript** : typage statique du code
- **Vite** : serveur de développement et bundler
- **React Router DOM** : navigation entre les pages
- **Sass** : styles organisés dans des fichiers `.scss`
- **Bootstrap** : composants et utilitaires CSS

### Données et formulaires

- **TanStack React Query** : récupération, mise en cache et synchronisation des données de l’API
- **Zustand** : gestion globale des filtres
- **TanStack React Table** : tableau des dépenses et pagination manuelle
- **React Hook Form** : gestion et validation des formulaires
- **Fetch API** : appels HTTP vers le backend

### Interface et visualisation

- **Recharts** : graphique des dépenses
- **Font Awesome** : icônes des actions
- **React Hot Toast** : notifications utilisateur
- **React Spinners** : indicateurs de chargement

### Outils de développement

- **ESLint** : analyse et qualité du code
- **TypeScript ESLint** : règles ESLint pour TypeScript
- **ESLint React Hooks** et **React Refresh** : règles spécifiques à React

## Prérequis

- Node.js et npm
- Le backend de Budget Manager démarré en local
- L’API accessible à l’adresse `https://localhost:7208`

Les services frontend utilisent actuellement les endpoints suivants :

```text
GET    https://localhost:7208/api/transaction
POST   https://localhost:7208/api/transaction
PUT    https://localhost:7208/api/transaction/:id
DELETE https://localhost:7208/api/transaction/:id
GET    https://localhost:7208/api/category
```

## Installation

Depuis ce dossier :

```bash
npm install
```

## Démarrage

Lancer le serveur de développement :

```bash
npm run dev
```

Vite affiche ensuite l’URL de l’application dans le terminal, généralement `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev      # démarre le serveur de développement
npm run build    # vérifie TypeScript et génère le build de production
npm run lint     # lance ESLint
npm run preview  # prévisualise le build de production
```

## Organisation du projet

```text
src/
├── components/   # composants réutilisables : navigation, tableau, graphique...
├── hooks/        # hooks React Query liés aux dépenses et catégories
├── Modals/       # fenêtres d’ajout et de modification
├── models/       # types TypeScript du domaine
├── pages/        # pages de l’application
├── services/     # appels HTTP vers l’API
└── stores/       # état global des filtres avec Zustand
```

## Build de production

Pour générer les fichiers de production :

```bash
npm run build
```

Le résultat est généré dans le dossier `dist/`. Il peut être vérifié localement avec :

```bash
npm run preview
```
