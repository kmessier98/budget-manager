# Budget Manager - Frontend Vue

Frontend de l'application Budget Manager. Cette application permet de se connecter, de gerer ses depenses et ses categories, puis de consulter le total et une visualisation graphique des depenses.

## Fonctionnalites

- inscription et connexion des utilisateurs ;
- protection des routes privees avec verification de la session ;
- ajout, modification et suppression des depenses ;
- gestion et selection des categories ;
- affichage des depenses dans un tableau ;
- calcul du montant total ;
- visualisation des depenses avec un graphique ;
- notifications et indicateurs de chargement.

## Technologies utilisees

### Application

- **Vue 3** : framework frontend et composants en `Single File Components` ;
- **TypeScript** : typage statique du code ;
- **Vite** : serveur de developpement et outil de build ;
- **Vue Router** : navigation entre les pages et routes protegees ;
- **Pinia** : gestion de l'etat global, notamment l'authentification, les categories et les depenses ;
- **Zod** : validation et securisation des donnees ;
- **Chart.js** : generation du graphique des depenses.

### Interface et styles

- **PrimeVue** : composants d'interface ;
- **PrimeVue Aura** : theme de l'interface ;
- **PrimeIcons** : icones PrimeVue ;
- **Bootstrap 5** : utilitaires et composants JavaScript ;
- **Sass/SCSS** : variables et styles personnalises.

### Outils de developpement

- **Node.js** : environnement d'execution (version `20.19+` ou `22.12+`) ;
- **npm** : installation des dependances et execution des scripts ;
- **vue-tsc** : verification des types Vue et TypeScript ;
- **vite-plugin-vue-devtools** : outils de debug Vue dans le navigateur.

## Prerequis

- Node.js `20.19+` ou `22.12+` ;
- npm ;
- API backend Budget Manager demarree sur `https://localhost:7208`.

Le serveur Vite redirige automatiquement les requetes commencant par `/api` vers cette API. Le certificat HTTPS local du backend doit donc etre accepte par votre environnement de developpement.

## Installation

Depuis le dossier du projet :

```bash
npm install
```

## Demarrage en developpement

```bash
npm run dev
```

Vite affiche ensuite l'URL locale de l'application, generalement `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev         # demarre le serveur de developpement
npm run type-check  # verifie les types TypeScript et Vue
npm run build-only  # genere le build de production
npm run build       # verifie les types puis genere le build de production
npm run preview     # sert localement le build de production
```

## Organisation du projet

```text
src/
├── assets/                 # images et styles SCSS globaux
├── components/             # composants partages (header, footer, icones)
├── features/
│   ├── auth/               # inscription, connexion et etat utilisateur
│   ├── categories/         # modele et store des categories
│   └── expenses/           # depenses, tableau, formulaire et graphique
├── models/                 # modeles partages, dont la pagination
├── router/                 # configuration des routes et gardes d'authentification
├── App.vue                 # structure principale de l'application
└── main.ts                 # initialisation de Vue, Pinia, PrimeVue et du routeur
```

## Parcours principal

1. L'utilisateur cree un compte ou se connecte depuis `/register` ou `/login`.
2. Une session valide permet d'acceder au tableau de bord `/dashboard`.
3. Le tableau de bord charge les categories et affiche les outils de gestion des depenses.
4. Les routes protegees redirigent automatiquement les utilisateurs non connectes vers `/login`.

## Configuration de l'API

Le proxy de developpement est configure dans `vite.config.ts` :

```text
/api/* -> https://localhost:7208/api/*
```

Pour utiliser une autre adresse d'API, adaptez la cible du proxy dans ce fichier avant de lancer Vite.
