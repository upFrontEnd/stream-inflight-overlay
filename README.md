# Flight Stream Overlay
Le projet est construit progressivement à partir d'un ancien overlay Photoshop, avec l'objectif de conserver une lecture claire tout en modernisant le rendu dans un style inspiré de l'avionique.

## État actuel

Le design est actuellement fonctionnel en HTML/CSS et comprend :

- un bandeau supérieur responsive sur une base logique de **1920 px** ;
- un module central avec le logo du projet ;
- une barre de progression courbe placée au-dessus du logo ;
- l'affichage du pourcentage de progression dans l'espace central de la barre ;
- les informations principales de vol :
  - `CALLSIGN` ;
  - `NETWORK` ;
  - phase de vol (`CRUISE`, `CLIMB`, `DESCENT`, etc.) ;
  - `AIRCRAFT` ;
- les informations communautaires :
  - `LATEST FOLLOWER` ;
  - `LATEST SUB` ;
- le départ et l'arrivée sous la forme :
  - drapeau du pays ;
  - `DEP` / `ARR` ;
  - code OACI de l'aéroport ;
- une géométrie gauche / droite conçue pour rester symétrique autour du demi-cercle central.

## Technologies

- HTML5
- CSS3
- JavaScript vanilla
- SVG inline pour les pictogrammes
- SVG pour le logo
- OBS Browser Source

Aucun framework n'est requis.

## Structure du projet

```text
project/
├── index.html
├── style.css
├── overlay.js
├── Logo.min.svg
├── airport-countries.js     # prévu pour la correspondance OACI -> pays
└── README.md
```

## Fichiers principaux

### `index.html`

Contient la structure visuelle de l'overlay :

- pictogrammes SVG ;
- blocs d'informations ;
- départ / arrivée ;
- drapeaux ;
- module central ;
- logo ;
- barre de progression.

Les éléments destinés à recevoir des données dynamiques possèdent progressivement des identifiants dédiés, par exemple :

```html
<span id="departure-code">LFPG</span>
<span id="arrival-code">KJFK</span>
<span id="flight-phase">CRUISE</span>
```

### `style.css`

Gère :

- la mise en page générale ;
- la symétrie gauche / droite ;
- les biseaux ;
- les couleurs ;
- le responsive ;
- les supports `DEP` / `ARR` ;
- les drapeaux ;
- la progression centrale ;
- les ombres et finitions visuelles.

Le design est basé sur une largeur logique de :

```css
width: 1920px;
```

Le JavaScript adapte ensuite l'échelle à la taille disponible.

### `overlay.js`

Le JavaScript sert de couche entre les données et l'interface.

Il gère actuellement ou est prévu pour gérer :

- le redimensionnement de l'overlay ;
- le pourcentage de progression ;
- le changement du code OACI de départ ;
- le changement du code OACI d'arrivée ;
- la sélection automatique du pays ;
- l'affichage du drapeau correspondant ;
- les futures données fournies par StreamFlight.

## API JavaScript interne

### Progression du vol

```js
setFlightProgress(37);
```

Valeurs acceptées :

```text
0 -> 100
```

Exemples :

```js
setFlightProgress(0);
setFlightProgress(25);
setFlightProgress(50);
setFlightProgress(75);
setFlightProgress(100);
```

### Modifier l'aéroport de départ

```js
setDepartureAirport("LFPG", "FR");
```

### Modifier l'aéroport d'arrivée

```js
setArrivalAirport("KJFK", "US");
```

### Modifier les deux aéroports

```js
setAirports({
  departure: "LFPG",
  arrival: "KJFK",
  departureCountry: "FR",
  arrivalCountry: "US"
});
```

Lorsque la base `airport-countries.js` sera installée, l'objectif est de pouvoir simplement écrire :

```js
setAirports({
  departure: "RJTT",
  arrival: "YSSY"
});
```

Le système devra alors déterminer automatiquement :

```text
RJTT -> JP -> Japon
YSSY -> AU -> Australie
```

puis afficher les bons drapeaux.

## Gestion des drapeaux

Le principe retenu est :

```text
Code OACI
   ↓
Base des aéroports
   ↓
Code pays ISO 3166-1 alpha-2
   ↓
Drapeau SVG
```

Exemple :

```text
LFPG -> FR -> France
KJFK -> US -> États-Unis
RJTT -> JP -> Japon
YSSY -> AU -> Australie
```

Cette méthode est préférable à une simple déduction à partir des premières lettres du code OACI.

Si un aéroport n'est pas trouvé dans la base, l'overlay devra masquer le drapeau ou utiliser un fallback neutre plutôt que d'afficher un pays incorrect.

## StreamFlight

L'intégration StreamFlight n'est pas encore finalisée.

L'objectif est de remplacer progressivement les valeurs statiques présentes dans l'overlay par les données réelles du vol.

Les informations prévues sont notamment :

```text
CALLSIGN
NETWORK
FLIGHT PHASE
AIRCRAFT
DEPARTURE ICAO
ARRIVAL ICAO
FLIGHT PROGRESS
```

Selon la donnée disponible dans StreamFlight, l'intégration pourra être faite directement ou par calcul dans `overlay.js`.

Le JavaScript restera la couche principale de transformation entre les données StreamFlight et le DOM.

## Phase de vol

L'ancien item `ETA` a été remplacé par la **phase de vol**.

Exemples de valeurs possibles :

```text
PREFLIGHT
TAXI
TAKEOFF
CLIMB
CRUISE
DESCENT
APPROACH
LANDING
```

Dans le HTML :

```html
<span id="flight-phase" class="info-label">
  CRUISE
</span>
```

La valeur sera ensuite mise à jour dynamiquement.

## Bloc départ / arrivée

La structure visuelle actuelle est conçue ainsi :

```text
🇫🇷   DEP                         ARR   🇺🇸
      LFPG        MODULE          KJFK
                  CENTRAL
```

Chaque support :

- possède une bordure sombre uniforme ;
- passe légèrement sous le module central ;
- reste symétrique avec son équivalent opposé ;
- affiche le drapeau côté extérieur ;
- affiche le type (`DEP` / `ARR`) au-dessus du code OACI.

## Responsive

L'overlay utilise une scène de référence de :

```text
1920 px de large
160 px de haut environ
```

La fonction de redimensionnement adapte ensuite l'échelle au viewport disponible.

Cela permet de conserver les proportions dans :

- OBS ;
- une fenêtre de navigateur ;
- différentes résolutions de capture.

## Utilisation dans OBS

Le projet est destiné à être chargé dans une **Browser Source** OBS.

Pour les tests locaux, ouvrir `index.html` dans un navigateur suffit.

Pour OBS, utiliser le fichier HTML local comme source navigateur et conserver un fond transparent.

Résolution de travail recommandée :

```text
1920 x 1080
```

L'overlay lui-même occupe uniquement la partie supérieure de la scène.

## Palette actuelle

Couleurs principales :

```css
--blue: #009fe3;
--blue-light: #4ac7ff;
--dark: #252e35;
--green: #4caf50;
--white: #ffffff;
```

Le module central utilise un dégradé bleu sombre inspiré d'un affichage avionique.

## Principes de design retenus

Le projet suit actuellement plusieurs règles :

- symétrie gauche / droite ;
- priorité à la lisibilité pendant le stream ;
- pictogrammes en SVG ;
- peu d'éléments décoratifs inutiles ;
- hiérarchie visuelle claire ;
- informations essentielles visibles immédiatement ;
- module central réservé à la progression et à l'identité visuelle ;
- compatibilité OBS et navigateur.

## Prochaines étapes

Les prochaines étapes prévues sont :

1. finaliser le design et les espacements ;
2. terminer la phase de vol ;
3. créer `airport-countries.js` avec une base OACI -> pays ;
4. rendre les drapeaux entièrement automatiques ;
5. connecter les données StreamFlight ;
6. connecter la progression réelle du vol ;
7. connecter les données `CALLSIGN`, `NETWORK` et `AIRCRAFT` ;
8. connecter `LATEST FOLLOWER` et `LATEST SUB` à la source utilisée pour le stream ;
9. ajouter les animations finales ;
10. tester le rendu définitif dans OBS.

## Convention de travail

Pour faciliter les modifications du projet :

- lorsqu'un seul fichier change, seul ce fichier est modifié ;
- lorsqu'une modification nécessite plusieurs fichiers, ils sont traités séparément ;
- le HTML est validé avant de passer au CSS lorsque les deux doivent changer ;
- le JavaScript est traité ensuite lorsque nécessaire ;
- les versions complètes des fichiers sont privilégiées afin d'éviter les modifications partielles difficiles à suivre.

## Statut

Projet en développement actif.

Le design est déjà suffisamment avancé pour poursuivre la connexion des données sans devoir reconstruire l'architecture de l'overlay.
