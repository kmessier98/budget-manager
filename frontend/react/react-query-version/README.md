# Budget Manager

Application web de gestion des depenses, developpee avec React et TypeScript.
Cette version utilise TanStack React Query pour charger et mettre en cache les
donnees provenant de l'API backend.

## Fonctionnalites

- Affichage des depenses dans un tableau pagine
- Filtrage par annee, mois, jour et categorie
- Ajout, modification et suppression d'une depense
- Calcul du montant total des depenses filtrees
- Visualisation des montants par categorie sous forme de graphique
- Chargement, erreurs et notifications utilisateur geres dans l'interface
- Navigation disponible sur `/` et `/expense-manager`

## Technologies utilisees

### Application

- **React 19** : construction de l'interface utilisateur
- **TypeScript** : typage statique du code
- **Vite** : serveur de developpement et outil de build
- **React Router DOM 7** : gestion de la navigation
- **Sass** : styles et fichiers SCSS
- **Bootstrap 5** : composants et classes utilitaires d'interface
- **Font Awesome** : icones de l'application

### Donnees et composants

- **TanStack React Query 5** : requetes, cache et mutations vers l'API
- **TanStack React Table 8** : tableau des depenses et pagination
- **React Hook Form** : gestion et validation des formulaires
- **Recharts** : graphique des depenses par categorie
- **React Hot Toast** : notifications apres les actions utilisateur
- **React Spinners** : indicateur de chargement

### Qualite et outillage

- **ESLint** : analyse statique et controle du style de code
- **TypeScript ESLint** : regles ESLint pour TypeScript
- **React Hooks ESLint** : verification des regles des hooks React

## Prerequis

- Node.js et npm
- Le backend Budget Manager demarre en local
- L'API backend accessible sur `https://localhost:7208`

L'application utilise les endpoints suivants :

- `GET`, `POST` et `PUT https://localhost:7208/api/transaction`
- `DELETE https://localhost:7208/api/transaction/:id`
- `GET https://localhost:7208/api/category`

Verifiez egalement que le certificat HTTPS local du backend est approuve par
votre systeme avant de lancer l'application.

## Installation

Depuis le dossier `react-query-version` :

```bash
npm install
```

## Demarrage en developpement

```bash
npm run dev
```

Vite affiche ensuite l'URL locale a ouvrir dans le navigateur, generalement
`http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev      # lance le serveur de developpement Vite
npm run build    # verifie TypeScript et genere le build de production
npm run lint     # lance ESLint sur le projet
npm run preview  # sert localement le build de production
```

## Structure principale

```text
src/
├── components/  # tableau, graphique, barre d'outils, navigation et resume
├── hooks/       # hooks React Query pour les depenses et categories
├── Modals/      # fenetres d'ajout et de modification
├── models/      # types TypeScript du domaine
├── pages/       # pages de l'application
└── services/    # appels HTTP vers l'API backend
```

## Build de production

```bash
npm run build
npm run preview
```

Le dossier genere peut ensuite etre deploye sur un hebergement statique. Le
backend doit rester accessible depuis le navigateur et autoriser les requetes
CORS provenant de l'URL du frontend.
