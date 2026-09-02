# Budget Manager - Frontend Angular

Interface web de gestion des depenses et du budget. Elle permet de consulter les
depenses, de les filtrer par date et categorie, de les paginer, puis de visualiser
la repartition des montants par categorie.

Ce projet est le frontend Angular de Budget Manager. Les donnees sont recuperees
depuis une API HTTP distincte.

## Fonctionnalites

- consultation des depenses dans un tableau;
- filtrage par annee, mois, jour et categorie;
- pagination des resultats;
- ajout, modification et suppression d'une depense;
- affichage du montant total;
- graphique de repartition des depenses par categorie;
- chargement des categories depuis l'API;
- indicateurs de chargement et confirmation avant suppression.

## Technologies utilisees

### Application

| Technologie        | Utilisation                                 |
| ------------------ | ------------------------------------------- |
| Angular 21         | framework frontend et composants standalone |
| TypeScript 5.9     | langage de developpement                    |
| Angular Router     | navigation de l'application                 |
| Angular HttpClient | appels vers l'API REST                      |
| Angular Signals    | etat reactif des filtres et des donnees     |
| RxJS 7.8           | gestion des flux asynchrones                |

### Interface et visualisation

| Technologie   | Utilisation                                                          |
| ------------- | -------------------------------------------------------------------- |
| PrimeNG 21    | composants d'interface, tableaux, boutons, formulaires et graphiques |
| PrimeIcons 7  | icones PrimeNG                                                       |
| Bootstrap 5.3 | grille, styles et composants utilitaires                             |
| SCSS          | styles globaux et styles des composants                              |
| Chart.js 4.5  | moteur utilise par le graphique PrimeNG                              |

### Outils de developpement

| Outil          | Utilisation                               |
| -------------- | ----------------------------------------- |
| Angular CLI 21 | developpement, build et tests             |
| npm 11         | gestion des dependances et scripts        |
| Vitest         | execution des tests unitaires via Angular |
| Prettier       | formatage du code                         |

## Prerequis

- Node.js compatible avec Angular 21;
- npm 11 ou une version compatible;
- l'API Budget Manager demarree sur `https://localhost:7208`.

## Installation et demarrage

Depuis ce dossier (`frontend/angular/angular-app`) :

```bash
npm install
npm start
```

L'application est ensuite disponible a l'adresse affichee par Angular, generalement
`http://localhost:4200/`.

## Configuration de l'API

L'URL de l'API est definie dans `src/environment.ts` :

```ts
export const environment = {
  apiUrl: 'https://localhost:7208/api',
};
```

Adaptez `apiUrl` si le backend utilise un autre port ou une autre adresse. En
developpement, le certificat HTTPS local de l'API doit etre reconnu par le
navigateur pour que les appels fonctionnent.

## Scripts npm

```bash
npm start       # demarre le serveur de developpement
npm run build   # genere le build de production
npm run watch   # reconstruit automatiquement en mode developpement
npm test        # lance les tests unitaires
npm run ng      # expose directement Angular CLI
```

## Structure principale

```text
src/
	app/
		features/
			categories/       # modele et service des categories
			expenses/         # composants, modele, service et page des depenses
		layouts/
			navbar/           # barre de navigation
			footer/           # pied de page
		models/             # modeles partages, dont la pagination
		services/           # service generique d'appels API
	environment.ts        # configuration de l'URL de l'API
	styles.scss            # styles globaux, Bootstrap et PrimeIcons
public/assets/           # ressources statiques
```

## Build et tests

Pour verifier le projet avant livraison :

```bash
npm run build
npm test
```
