# Atiko Front-Office - Intégration API

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet front-office avec :

```env
REACT_APP_API_URL=http://localhost:8081
```

Pour la production, modifiez cette URL vers votre serveur backend.

## Architecture des Services

### Structure des fichiers

```
src/
├── services/
│   ├── api.js                 # Configuration Axios avec intercepteurs
│   ├── authService.js         # Authentification (login, register, logout)
│   ├── voitureService.js      # Gestion des véhicules
│   ├── reservationService.js  # Gestion des réservations
│   └── contactService.js      # Contact et newsletter
├── utils/
│   ├── auth.js               # Utilitaires d'authentification (wrapper)
│   └── bookings.js           # Utilitaires de réservation (wrapper)
└── pages/
    ├── AuthPage.js           # Page de connexion/inscription
    ├── HomePage.js           # Page d'accueil avec véhicules populaires
    ├── CarRentalPage.js      # Liste des véhicules avec filtres
    ├── CarDetailPage.js      # Détails d'un véhicule
    ├── CheckoutPage.js       # Page de paiement
    ├── DashboardPage.js      # Tableau de bord utilisateur
    └── ContactPage.js        # Page de contact
```

## Endpoints API utilisés

### Authentification (`/auth`)

- **POST** `/auth/signin` - Connexion
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

- **POST** `/auth/signup` - Inscription
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": ["ROLE_USER"]
  }
  ```

- **POST** `/auth/forgot-password?email={email}` - Mot de passe oublié

- **POST** `/auth/reset-password?token={token}&newPassword={password}` - Réinitialisation

### Utilisateur (`/api`)

- **GET** `/api/user` - Récupérer l'utilisateur connecté (avec JWT)

### Véhicules (`/api/voitures`)

- **GET** `/api/voitures` - Liste de tous les véhicules
- **GET** `/api/voitures/{id}` - Détails d'un véhicule
- **GET** `/api/voitures/search/{nom}` - Rechercher des véhicules
- **GET** `/api/voitures/modele/{modeleId}` - Véhicules par modèle

### Réservations (`/api/reservations`)

- **POST** `/api/reservations` - Créer une réservation
  ```json
  {
    "clientId": 1,
    "vehiculeId": 1,
    "dateDebutPrevue": "2024-01-15T10:00:00",
    "dateFinPrevue": "2024-01-20T10:00:00",
    "lieuDepart": "Dakar",
    "lieuRetour": "Dakar",
    "etatReservation": "EN_ATTENTE",
    "modePaiement": "CARTE",
    "montantTotal": 150000,
    "acompte": 50000
  }
  ```

- **GET** `/api/reservations` - Liste des réservations (avec filtres optionnels)
  - Query params: `clientId`, `vehiculeId`, `etat`

- **GET** `/api/reservations/{id}` - Détails d'une réservation

- **PUT** `/api/reservations/{id}` - Modifier une réservation

- **DELETE** `/api/reservations/{id}` - Supprimer une réservation

- **GET** `/api/reservations/check-availability` - Vérifier disponibilité
  - Query params: `vehiculeId`, `dateDebut`, `dateFin`

### Contact (`/unauth`)

- **POST** `/unauth/contact` - Envoyer un message de contact
  ```json
  {
    "nom": "string",
    "email": "string",
    "telephone": "string",
    "sujet": "string",
    "message": "string"
  }
  ```

- **POST** `/unauth/newsletter` - S'inscrire à la newsletter
  ```json
  {
    "email": "string"
  }
  ```

- **GET** `/unauth/structure` - Informations de la structure

## Flux utilisateur complet

### 1. Inscription / Connexion

```javascript
// Inscription
const result = await authService.register(username, email, password);

// Connexion
const result = await authService.login(username, password);
// Le token JWT est automatiquement stocké dans localStorage
```

### 2. Navigation et recherche de véhicules

```javascript
// Charger tous les véhicules
const result = await voitureService.getAllVoitures();

// Les véhicules sont transformés pour l'affichage
const cars = result.data.map(v => voitureService.transformVoitureForDisplay(v));
```

### 3. Sélection d'un véhicule

```javascript
// Charger les détails
const result = await voitureService.getVoitureById(id);

// Vérifier la disponibilité
const availability = await reservationService.checkAvailability(
  vehicleId,
  startDate,
  endDate
);
```

### 4. Réservation et paiement

```javascript
// Créer la réservation
const bookingData = {
  vehicleId: car.id,
  startDate: '2024-01-15T10:00:00',
  endDate: '2024-01-20T10:00:00',
  totalPrice: 150000,
  paymentMethod: 'CARTE',
  details: { ... }
};

const booking = await saveBooking(bookingData);
```

### 5. Gestion des réservations

```javascript
// Récupérer les réservations de l'utilisateur
const bookings = await getBookings();

// Annuler une réservation
await cancelBooking(bookingId);
```

## Gestion des erreurs

Tous les services retournent un objet standardisé :

```javascript
{
  success: boolean,
  data?: any,
  error?: string
}
```

Les erreurs sont automatiquement gérées par les intercepteurs Axios :
- Erreur 401 : Redirection vers `/auth`
- Autres erreurs : Affichage via `toast.error()`

## Authentification JWT

Le token JWT est :
1. Stocké dans `localStorage` sous la clé `atikoUser`
2. Automatiquement ajouté aux headers de toutes les requêtes API
3. Vérifié à chaque navigation vers des pages protégées

```javascript
// Structure de l'objet utilisateur stocké
{
  id: number,
  username: string,
  email: string,
  name: string,
  token: string,
  roles: string[]
}
```

## États de réservation

- `EN_ATTENTE` - Réservation créée, en attente de confirmation
- `CONFIRME` - Réservation confirmée
- `ANNULE` - Réservation annulée
- `TERMINEE` - Réservation terminée

## Modes de paiement

- `CARTE` - Carte bancaire (Stripe)
- `MOBILE_MONEY` - Mobile Money (Orange Money, Wave, Free Money)
- `ESPECES` - Paiement en espèces
- `VIREMENT` - Virement bancaire

## Tests et développement

### Démarrer le backend

```bash
cd Atiko
mvn spring-boot:run
# Backend sur http://localhost:8081
```

### Démarrer le frontend

```bash
cd front-office
npm start
# Frontend sur http://localhost:3000
```

### Tester l'intégration

1. Créer un compte utilisateur
2. Se connecter
3. Parcourir les véhicules
4. Créer une réservation
5. Vérifier dans le dashboard

## CORS

Le backend doit autoriser les requêtes depuis `http://localhost:3000` en développement.

Configuration dans le backend (déjà présente) :
```java
@CrossOrigin(origins = "*", maxAge = 3600)
```

## Production

Pour la production :

1. Mettre à jour `.env` avec l'URL de production
2. Build le frontend : `npm run build`
3. Les fichiers sont générés dans `../src/main/resources/static/front`
4. Déployer le backend avec le frontend intégré

## Améliorations futures

- [ ] Implémenter Google OAuth
- [ ] Ajouter la pagination pour les listes
- [ ] Implémenter le cache côté client
- [ ] Ajouter des websockets pour les notifications en temps réel
- [ ] Implémenter le paiement Stripe réel
- [ ] Ajouter la gestion des images multiples
- [ ] Implémenter les filtres avancés
