# Guide de test - Intégration API Front Office

## 🧪 Prérequis

1. **Backend démarré**
   ```bash
   cd Atiko
   mvn spring-boot:run
   ```
   Vérifier : http://localhost:8081/actuator/health (si activé)

2. **Base de données PostgreSQL**
   - Base : `database`
   - User : `postgres`
   - Password : `postgres`
   - Port : `5432`

3. **Frontend démarré**
   ```bash
   cd front-office
   npm install
   npm start
   ```
   Vérifier : http://localhost:3000

## 📋 Scénarios de test

### Test 1 : Inscription d'un nouvel utilisateur

1. Aller sur http://localhost:3000/auth
2. Cliquer sur l'onglet "Inscription"
3. Remplir le formulaire :
   - Nom d'utilisateur : `testuser`
   - Email : `test@example.com`
   - Mot de passe : `password123`
4. Cliquer sur "S'inscrire"

**Résultat attendu :**
- ✅ Message de succès "Inscription réussie"
- ✅ Basculement automatique vers l'onglet "Connexion"
- ✅ Vérifier dans la base : `SELECT * FROM users WHERE username = 'testuser';`

**En cas d'erreur :**
- Vérifier les logs du backend
- Vérifier que l'email n'existe pas déjà
- Vérifier que le mot de passe fait au moins 6 caractères

---

### Test 2 : Connexion

1. Sur la page `/auth`, onglet "Connexion"
2. Saisir :
   - Nom d'utilisateur : `testuser`
   - Mot de passe : `password123`
3. Cliquer sur "Se connecter"

**Résultat attendu :**
- ✅ Redirection vers `/dashboard`
- ✅ Message "Bonjour, testuser !"
- ✅ Token JWT stocké dans localStorage (F12 > Application > Local Storage)
- ✅ Clé `atikoUser` contient : `{ id, username, email, token, roles }`

**Vérification du token :**
```javascript
// Dans la console du navigateur
const user = JSON.parse(localStorage.getItem('atikoUser'));
console.log(user);
```

---

### Test 3 : Affichage des véhicules (Page d'accueil)

1. Aller sur http://localhost:3000
2. Attendre le chargement

**Résultat attendu :**
- ✅ Affichage de 3 véhicules populaires (ou moins si moins de véhicules en BDD)
- ✅ Chaque carte affiche : nom, image, prix, catégorie, ville
- ✅ Bouton "Réserver" fonctionnel

**Si aucun véhicule :**
- Ajouter des véhicules via le back-office
- Vérifier que `statut = true` et `disponibilite = 'disponible'`
- Vérifier dans la BDD : `SELECT * FROM voiture WHERE statut = true;`

---

### Test 4 : Liste complète des véhicules

1. Cliquer sur "Voir tout" ou aller sur `/cars`
2. Attendre le chargement

**Résultat attendu :**
- ✅ Liste de tous les véhicules disponibles
- ✅ Filtres fonctionnels (ville, catégorie, prix)
- ✅ Compteur "X véhicule(s) disponible(s)"

**Test des filtres :**
1. Sélectionner une ville → Liste filtrée
2. Sélectionner une catégorie → Liste filtrée
3. Ajuster le slider de prix → Liste filtrée
4. Cliquer sur "Réinitialiser" → Tous les véhicules réapparaissent

---

### Test 5 : Détails d'un véhicule

1. Sur `/cars`, cliquer sur "Voir les détails" d'un véhicule
2. Attendre le chargement

**Résultat attendu :**
- ✅ Image du véhicule
- ✅ Nom, ville, note
- ✅ Caractéristiques (transmission, places, carburant, catégorie)
- ✅ Description
- ✅ Prix par jour
- ✅ Sélecteurs de dates

**Test de sélection de dates :**
1. Sélectionner une date de début (aujourd'hui ou après)
2. Sélectionner une date de fin (après la date de début)
3. Vérifier que le calcul du total s'affiche
4. Vérifier que le bouton "Réserver maintenant" est activé

---

### Test 6 : Vérification de disponibilité

1. Sur la page de détails d'un véhicule
2. Sélectionner des dates
3. Observer la console du navigateur (F12)

**Résultat attendu :**
- ✅ Requête GET vers `/api/reservations/check-availability`
- ✅ Si disponible : aucun message d'erreur
- ✅ Si non disponible : toast warning "Véhicule non disponible pour ces dates"

**Pour tester l'indisponibilité :**
- Créer une réservation pour ce véhicule sur ces dates
- Réessayer avec les mêmes dates

---

### Test 7 : Créer une réservation (utilisateur connecté)

1. Se connecter si ce n'est pas fait
2. Aller sur les détails d'un véhicule
3. Sélectionner des dates valides
4. Cliquer sur "Réserver maintenant"
5. Sur la page checkout :
   - Vérifier le récapitulatif
   - Sélectionner un mode de paiement (Carte ou Mobile Money)
   - Remplir les informations de facturation
6. Cliquer sur "Confirmer le paiement"

**Résultat attendu :**
- ✅ Message "Paiement réussi !"
- ✅ Redirection vers `/dashboard` après 2 secondes
- ✅ Réservation visible dans le dashboard
- ✅ Vérifier dans la BDD : 
  ```sql
  SELECT * FROM reservation 
  WHERE client_id = (SELECT id FROM user_profile WHERE user_id = ...);
  ```

---

### Test 8 : Créer une réservation (utilisateur non connecté)

1. Se déconnecter (bouton "Déconnexion" dans le dashboard)
2. Aller sur les détails d'un véhicule
3. Sélectionner des dates
4. Cliquer sur "Réserver maintenant"

**Résultat attendu :**
- ✅ Redirection vers `/auth`
- ✅ Après connexion, retour sur la page du véhicule (si implémenté)

---

### Test 9 : Dashboard - Liste des réservations

1. Se connecter
2. Aller sur `/dashboard`
3. Onglet "Mes réservations"

**Résultat attendu :**
- ✅ Liste de toutes les réservations de l'utilisateur
- ✅ Chaque réservation affiche :
  - Type (Voiture)
  - Détails (nom, dates, ville)
  - Statut (badge coloré)
  - Prix total
  - Boutons "PDF" et "Annuler"
- ✅ Statistiques en haut :
  - Total réservations
  - Réservations actives
  - Réservations annulées

**Si aucune réservation :**
- Message "Aucune réservation"
- Bouton "Découvrir nos offres"

---

### Test 10 : Annuler une réservation

1. Dans le dashboard, sur une réservation avec statut "Confirmé"
2. Cliquer sur "Annuler"
3. Confirmer dans la popup

**Résultat attendu :**
- ✅ Popup de confirmation
- ✅ Statut passe à "Annulé" (badge rouge)
- ✅ Bouton "Annuler" disparaît
- ✅ Statistiques mises à jour
- ✅ Vérifier dans la BDD : 
  ```sql
  SELECT etat_reservation FROM reservation WHERE reservation_id = ...;
  -- Doit être 'ANNULE'
  ```

---

### Test 11 : Télécharger un ticket PDF

1. Dans le dashboard, sur une réservation
2. Cliquer sur le bouton "PDF"

**Résultat attendu :**
- ✅ Téléchargement d'un fichier PDF
- ✅ Le PDF contient les informations de la réservation

---

### Test 12 : Formulaire de contact

1. Aller sur `/contact`
2. Remplir le formulaire :
   - Nom : `Jean Dupont`
   - Email : `jean@example.com`
   - Téléphone : `+221 77 123 45 67`
   - Sujet : `Question sur les tarifs`
   - Message : `Je voudrais des informations...`
3. Cliquer sur "Envoyer le message"

**Résultat attendu :**
- ✅ Message de succès "Message envoyé avec succès!"
- ✅ Formulaire réinitialisé
- ✅ Vérifier dans la BDD : 
  ```sql
  SELECT * FROM contact ORDER BY id DESC LIMIT 1;
  ```

---

### Test 13 : Déconnexion

1. Dans le dashboard, cliquer sur "Déconnexion"

**Résultat attendu :**
- ✅ Redirection vers `/`
- ✅ Token supprimé du localStorage
- ✅ Vérifier : `localStorage.getItem('atikoUser')` retourne `null`

---

### Test 14 : Protection des routes

1. Se déconnecter
2. Essayer d'accéder à `/dashboard` directement

**Résultat attendu :**
- ✅ Redirection automatique vers `/auth`

---

## 🔍 Tests de validation

### Validation des formulaires

**Inscription :**
- ❌ Nom d'utilisateur vide → Message d'erreur
- ❌ Email invalide → Message d'erreur
- ❌ Mot de passe < 6 caractères → Message d'erreur
- ❌ Email déjà utilisé → Message "Email déjà pris"

**Connexion :**
- ❌ Identifiants incorrects → Message "Erreur de connexion"
- ❌ Champs vides → Message "Veuillez remplir tous les champs"

**Réservation :**
- ❌ Date de fin avant date de début → Message d'erreur
- ❌ Dates non sélectionnées → Bouton désactivé

**Contact :**
- ❌ Email invalide → Validation HTML5
- ❌ Champs obligatoires vides → Validation HTML5

---

## 🐛 Débogage

### Problème : "Erreur de connexion au serveur"

**Vérifications :**
1. Backend démarré ? `curl http://localhost:8081/api/voitures`
2. CORS configuré ? Vérifier `@CrossOrigin` dans les controllers
3. Firewall ? Vérifier les ports 8081 et 3000

### Problème : "Véhicule non trouvé"

**Vérifications :**
1. Véhicule existe en BDD ? `SELECT * FROM voiture WHERE id = ...;`
2. Véhicule actif ? `statut = true`
3. ID correct dans l'URL ?

### Problème : Token JWT expiré

**Solution :**
1. Se reconnecter
2. Vérifier l'expiration dans le backend (24h par défaut)

### Problème : Réservation échoue

**Vérifications :**
1. Utilisateur connecté ?
2. Token valide ?
3. Véhicule disponible ?
4. Dates valides ?
5. Logs du backend : `tail -f logs/spring.log`

---

## 📊 Tests de performance

### Temps de chargement attendus

- Page d'accueil : < 2s
- Liste des véhicules : < 3s
- Détails d'un véhicule : < 1s
- Création de réservation : < 2s
- Dashboard : < 2s

### Optimisations possibles

- Ajouter un cache côté client
- Implémenter la pagination
- Optimiser les images (lazy loading)
- Utiliser React Query pour le cache

---

## ✅ Checklist complète

- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Déconnexion fonctionne
- [ ] Liste des véhicules s'affiche
- [ ] Filtres fonctionnent
- [ ] Détails d'un véhicule s'affichent
- [ ] Vérification de disponibilité fonctionne
- [ ] Réservation (connecté) fonctionne
- [ ] Redirection vers login (non connecté) fonctionne
- [ ] Dashboard affiche les réservations
- [ ] Annulation de réservation fonctionne
- [ ] Téléchargement PDF fonctionne
- [ ] Formulaire de contact fonctionne
- [ ] Protection des routes fonctionne
- [ ] Gestion des erreurs fonctionne
- [ ] États de chargement s'affichent
- [ ] Toasts de notification fonctionnent

---

## 🎯 Résultat final

Si tous les tests passent, l'intégration est complète et fonctionnelle ! 🎉

Le front-office communique correctement avec le backend et toutes les fonctionnalités du user flow sont opérationnelles.
