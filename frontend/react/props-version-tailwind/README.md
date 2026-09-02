# Budget Manager

Application web de gestion des depenses, developpee avec React et TypeScript.
Cette version propose une interface responsive avec une barre de navigation,
une page de gestionnaire de depenses et des filtres par date et categorie.

## Technologies utilisees

- **React 19** : creation des composants et gestion de l'interface.
- **TypeScript** : typage statique du code JavaScript.
- **Vite** : serveur de developpement et outil de build.
- **React Router 7** : navigation entre les pages de l'application.
- **Tailwind CSS 4** : classes utilitaires pour la mise en page et le style.
- **CSS** : styles specifiques des composants et des pages (`.css`).
- **ESLint** : analyse et verification de la qualite du code.
- **Node.js / npm** : execution du projet et gestion des dependances.

> Bootstrap est present dans les dependances du projet, mais n'est pas utilise
> directement dans les composants actuels.

## Prerequis

- Node.js 18 ou une version plus recente.
- npm, installe avec Node.js.

## Installation

Depuis le dossier du projet :

```bash
npm install
```

## Demarrer l'application

Lancer le serveur de developpement :

```bash
npm run dev
```

Vite affiche ensuite une adresse locale, generalement
`http://localhost:5173`. Ouvrez cette adresse dans votre navigateur.

## Commandes disponibles

```bash
npm run dev      # demarre le serveur de developpement
npm run build    # verifie TypeScript et genere le build de production
npm run lint     # analyse le code avec ESLint
npm run preview  # sert localement le build de production
```

## Structure du projet

```text
src/
├── assets/                 # ressources statiques, comme l'avatar utilisateur
├── components/             # composants reutilisables
│   ├── ExpenseToolbar      # filtres du gestionnaire de depenses
│   ├── Footer              # pied de page
│   └── Navbar              # barre de navigation responsive
├── pages/
│   └── ExpenseManager      # page principale de gestion des depenses
├── App.tsx                 # structure commune de l'application
├── router.tsx              # configuration des routes
├── index.css               # styles globaux et configuration Tailwind
└── main.tsx                # point d'entree React
```

## Routes

- `/` : page principale du gestionnaire de depenses.
- `/expense-manager` : acces direct au gestionnaire de depenses.
