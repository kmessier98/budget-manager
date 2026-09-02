# Budget Manager - Angular V2

Application web de gestion des dépenses. Cette version permet de consulter, filtrer,
ajouter, modifier et supprimer des dépenses depuis une interface Angular connectée à
une API REST.

## Fonctionnalités

- Affichage de la liste des dépenses avec pagination
- Filtrage par année, mois, jour et catégorie
- Création et modification d'une dépense dans un formulaire modal
- Suppression d'une dépense avec confirmation
- Affichage du montant total
- Visualisation des dépenses sous forme de graphique
- Chargement et sélection des catégories
- Indicateurs de chargement et gestion des erreurs de communication avec l'API

## Technologies utilisées

### Application

- **Angular 21** : framework frontend et composants standalone
- **TypeScript 5.9** : langage de développement
- **RxJS 7.8** : gestion des flux asynchrones et des appels HTTP
- **Angular Router** : navigation et chargement lazy de la page principale
- **Angular Forms** : gestion des formulaires de dépenses
- **Angular CDK** : primitives de composants Angular

### Interface et visualisation

- **PrimeNG 21** : composants d'interface (table, formulaires, dialogues, messages et spinner)
- **PrimeNG Aura** : thème PrimeNG
- **PrimeIcons 7** : bibliothèque d'icônes
- **Bootstrap 5.3** : grille et styles utilitaires
- **SCSS** : styles globaux, variables et styles par composant
- **Chart.js 4.5** : graphique des dépenses

### Outils de développement

- **Angular CLI 21** : serveur de développement, build et tests
- **Vitest 4** et **JSDOM 28** : tests unitaires et environnement DOM
- **Prettier 3** : formatage du code
- **npm 11.6.2** : gestionnaire de paquets indiqué par le projet

## Prérequis

- Node.js compatible avec Angular 21
- npm 11.6.2 ou une version compatible
- Une API Budget Manager accessible depuis l'application

## Installation et démarrage

Depuis le dossier du projet :

```bash
npm install
npm start
```

L'application est ensuite disponible à l'adresse affichée par Angular, généralement
`http://localhost:4200`.

## Configuration de l'API

L'URL de base de l'API est définie dans
`src/environment.ts` :

```typescript
apiUrl: 'https://localhost:7208/api';
```

Avant de lancer l'application, vérifiez que l'API est démarrée à cette adresse ou
adaptez `apiUrl` à votre environnement. L'application utilise notamment la ressource
`transaction` pour les opérations sur les dépenses.

## Commandes disponibles

```bash
npm start       # démarre le serveur de développement
npm run build   # génère le build de production
npm run watch   # reconstruit l'application à chaque modification
npm test        # lance les tests unitaires
```

## Organisation du code

```text
src/
└── app/
	├── features/
	│   ├── categories/       # modèle et service des catégories
	│   └── expenses/         # page, composants, modèle et service des dépenses
	├── layouts/              # barre de navigation et pied de page
	├── models/               # modèles partagés, dont la pagination
	└── services/             # services partagés, dont l'accès à l'API
```

Les composants de la fonctionnalité dépenses sont organisés par responsabilité :
toolbar, formulaire modal, tableau, graphique, total et confirmation de suppression.
