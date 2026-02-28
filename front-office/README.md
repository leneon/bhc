# Atiko Front Office - Application de Réservation de Transport

Application React moderne pour la réservation de véhicules, bus et vols au Sénégal.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ et npm
- Backend Spring Boot démarré sur http://localhost:8081
- PostgreSQL avec la base de données configurée

### Installation

```bash
# Cloner le projet
cd front-office

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env si nécessaire (URL de l'API)

# Démarrer en mode développement
npm start
```

L'application sera accessible sur http://localhost:3000

## 📁 Structure du projet

```
front-office/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── ui/           # Composants UI (shadcn/ui)
│   │   ├── Navbar.js     # Navigation principale
│   │   └── Footer.js     # Pied de page
│   ├── pages/            # Pages de l'application
│   │   ├── HomePage.js
│   │   ├── AuthPage.js
│   │   ├── CarRentalPage.js
│   │   ├── CarDetailPage.js
│   │   ├── CheckoutPage.js
│   │   ├── DashboardPage.js
│   │   ├── ContactPage.js
│   │   └── AboutPage.js
│   ├── services/         # Services API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── voitureService.js
│   │   ├── reservationService.js
│   │   └── contactService.js
│   ├── utils/            # Utilitaires
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── mockData.js
│   │   └── pdf.js
│   ├── lib/              # Bibliothèques utilitaires
│   ├── hooks/            # Hooks personnalisés
│   ├── App.js            # Composant principal
│   ├── App.css           # Styles globaux
│   └── index.js          # Point d'entrée
├── .env                  # Variables d'environnement
├── package.json
└── tailwind.config.js    # Configuration Tailwind CSS
```

## 🎯 Fonctionnalités

### Authentification
- ✅ Inscription utilisateur
- ✅ Connexion (JWT)
- ✅ Déconnexion
- ✅ Protection des routes
- 🔄 Google OAuth (à venir)

### Véhicules
- ✅ Liste des véhicules disponibles
- ✅ Filtrage par ville, catégorie, prix
- ✅ Détails d'un véhicule
- ✅ Recherche par nom
- ✅ Vérification de disponibilité

### Réservations
- ✅ Création de réservation
- ✅ Sélection des dates
- ✅ Calcul automatique du prix
- ✅ Paiement (Carte, Mobile Money)
- ✅ Liste des réservations
- ✅ Annulation de réservation
- ✅ Téléchargement de ticket PDF

### Autres
- ✅ Formulaire de contact
- ✅ Page À propos
- ✅ Responsive design
- ✅ Notifications toast
- ✅ États de chargement

## 🔧 Scripts disponibles

### Développement

```bash
# Démarrer en mode développement
npm start

# Lancer les tests
npm test

# Lancer les tests en mode watch
npm test -- --watch

# Vérifier le linting
npm run lint
```

### Production

```bash
# Build pour la production
npm run build

# Les fichiers sont générés dans ../src/main/resources/static/front
# pour être servis par le backend Spring Boot
```

## 🌐 Configuration de l'API

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
REACT_APP_API_URL=http://localhost:8081
```

Pour la production, modifier cette URL vers votre serveur backend.

### Endpoints utilisés

- **Authentification** : `/auth/signin`, `/auth/signup`
- **Véhicules** : `/api/voitures`, `/api/voitures/{id}`
- **Réservations** : `/api/reservations`
- **Contact** : `/unauth/contact`

Voir [README_API.md](./README_API.md) pour la documentation complète.

## 🧪 Tests

### Lancer les tests

```bash
npm test
```

### Guide de test manuel

Voir [TESTING_GUIDE.md](./TESTING_GUIDE.md) pour les scénarios de test complets.

## 📚 Documentation

- **[README_API.md](./README_API.md)** - Documentation de l'intégration API
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Résumé des modifications
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guide de test complet
- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Bonnes pratiques et améliorations

## 🎨 Technologies utilisées

- **React 18** - Bibliothèque UI
- **React Router v7** - Routing
- **Axios** - Requêtes HTTP
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes
- **Sonner** - Notifications toast
- **jsPDF** - Génération de PDF

## 🔐 Authentification

L'application utilise JWT (JSON Web Token) pour l'authentification :

1. L'utilisateur se connecte avec username/password
2. Le backend retourne un token JWT
3. Le token est stocké dans localStorage
4. Le token est ajouté automatiquement aux headers de toutes les requêtes
5. Si le token expire (401), l'utilisateur est redirigé vers `/auth`

## 🚢 Déploiement

### Développement

```bash
# Terminal 1 - Backend
cd Atiko
mvn spring-boot:run

# Terminal 2 - Frontend
cd front-office
npm start
```

### Production

```bash
# Build du frontend
cd front-office
npm run build

# Le frontend est intégré dans le backend
cd ../
mvn clean package

# Démarrer l'application complète
java -jar target/Atiko-0.0.1-SNAPSHOT.jar
```

L'application complète sera accessible sur http://localhost:8081

## 🐛 Dépannage

### Erreur "Erreur de connexion au serveur"

- Vérifier que le backend est démarré sur le port 8081
- Vérifier la configuration CORS dans le backend
- Vérifier l'URL dans `.env`

### Erreur "Token JWT expiré"

- Se reconnecter
- Le token expire après 24h par défaut

### Les véhicules ne s'affichent pas

- Vérifier qu'il y a des véhicules en base de données
- Vérifier que `statut = true` et `disponibilite = 'disponible'`
- Vérifier les logs du backend

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence privée - Atiko © 2024

## 👥 Équipe

Développé avec ❤️ par l'équipe Atiko

## 📞 Support

Pour toute question ou problème :
- Email : support@atiko.sn
- Téléphone : +221 33 123 45 67

---

**Note** : Ce projet a été créé avec [Create React App](https://github.com/facebook/create-react-app).
