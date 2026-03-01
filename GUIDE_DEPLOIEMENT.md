# 🚀 Guide de déploiement - Atiko

## ⚠️ Problèmes résolus

### 1. Logo ne s'affiche pas
✅ **RÉSOLU** : Le logo utilise maintenant une icône SVG au lieu d'une image externe

### 2. Erreur CORS après déploiement
✅ **RÉSOLU** : Configuration CORS complète ajoutée

---

## 🔧 Configuration CORS pour le déploiement

### Fichiers modifiés

1. **Nouveau fichier** : `src/main/java/com/example/Atiko/config/CorsConfig.java`
   - Configuration CORS centralisée
   - Support des domaines multiples
   - Configuration via `application.properties`

2. **Modifié** : `src/main/java/com/example/Atiko/security/WebSecurityConfig.java`
   - Activation de CORS dans la chaîne de sécurité

3. **Modifié** : `src/main/resources/application.properties`
   - Ajout de la propriété `app.cors.allowed-origins`

---

## 📝 Configuration selon l'environnement

### Développement local

Dans `application.properties` :

```properties
# Autoriser localhost pour le développement
app.cors.allowed-origins=http://localhost:3000,http://localhost:8081
```

### Production avec nom de domaine

Dans `application.properties` :

```properties
# Remplacez par votre nom de domaine réel
app.cors.allowed-origins=https://votre-domaine.com,https://www.votre-domaine.com,https://api.votre-domaine.com
```

**Exemples :**
```properties
# Si votre site est sur atiko.sn
app.cors.allowed-origins=https://atiko.sn,https://www.atiko.sn,https://api.atiko.sn

# Si vous utilisez Vercel ou Netlify
app.cors.allowed-origins=https://atiko.vercel.app,https://atiko-api.vercel.app

# Si vous utilisez Heroku
app.cors.allowed-origins=https://atiko.herokuapp.com,https://atiko-api.herokuapp.com
```

### Autoriser tous les domaines (NON RECOMMANDÉ en production)

```properties
# À utiliser UNIQUEMENT pour les tests
app.cors.allowed-origins=*
```

⚠️ **ATTENTION** : Ne jamais utiliser `*` en production pour des raisons de sécurité !

---

## 🔍 Diagnostic des problèmes CORS

### Symptômes

```
Access to XMLHttpRequest at 'http://votre-api.com/api/voitures' 
from origin 'http://votre-site.com' has been blocked by CORS policy
```

### Vérifications

1. **Vérifier la configuration CORS**
   ```bash
   # Tester avec curl
   curl -H "Origin: https://votre-domaine.com" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Authorization" \
        -X OPTIONS \
        https://votre-api.com/api/voitures -v
   ```

2. **Vérifier les logs du backend**
   ```bash
   # Chercher les erreurs CORS
   tail -f logs/spring.log | grep -i cors
   ```

3. **Vérifier dans le navigateur**
   - Ouvrir la console (F12)
   - Onglet "Network"
   - Regarder les requêtes OPTIONS (preflight)
   - Vérifier les headers de réponse

---

## 🌐 Configuration du frontend

### Développement

Dans `front-office/.env` :

```env
REACT_APP_API_URL=http://localhost:8081
```

### Production

Dans `front-office/.env.production` (créer ce fichier) :

```env
REACT_APP_API_URL=https://votre-api.com
```

**Exemples :**
```env
# Si API et frontend sur le même domaine
REACT_APP_API_URL=https://atiko.sn

# Si API sur un sous-domaine
REACT_APP_API_URL=https://api.atiko.sn

# Si API sur un port différent
REACT_APP_API_URL=https://atiko.sn:8081
```

---

## 📦 Déploiement étape par étape

### Option 1 : Déploiement séparé (Frontend + Backend)

#### Backend (Spring Boot)

1. **Configurer le domaine dans `application.properties`**
   ```properties
   app.cors.allowed-origins=https://votre-frontend.com
   ```

2. **Build le backend**
   ```bash
   cd Atiko
   mvn clean package -DskipTests
   ```

3. **Déployer le JAR**
   ```bash
   java -jar target/Atiko-0.0.1-SNAPSHOT.jar
   ```

#### Frontend (React)

1. **Configurer l'URL de l'API**
   ```bash
   cd front-office
   echo "REACT_APP_API_URL=https://votre-api.com" > .env.production
   ```

2. **Build le frontend**
   ```bash
   npm run build
   ```

3. **Déployer les fichiers**
   - Copier le contenu de `build/` vers votre serveur web
   - Ou déployer sur Vercel/Netlify/etc.

### Option 2 : Déploiement intégré (Backend sert le Frontend)

1. **Build le frontend**
   ```bash
   cd front-office
   npm run build
   # Les fichiers sont copiés dans ../src/main/resources/static/front
   ```

2. **Configurer CORS pour le même domaine**
   ```properties
   # Dans application.properties
   app.cors.allowed-origins=https://votre-domaine.com
   ```

3. **Build et déployer le backend**
   ```bash
   cd ..
   mvn clean package -DskipTests
   java -jar target/Atiko-0.0.1-SNAPSHOT.jar
   ```

4. **Accéder à l'application**
   - Frontend : `https://votre-domaine.com/`
   - API : `https://votre-domaine.com/api/`

---

## 🐛 Résolution des problèmes courants

### Problème 1 : CORS bloque toujours après configuration

**Solution :**

1. Vérifier que `CorsConfig.java` est bien dans le package `config`
2. Redémarrer le backend complètement
3. Vider le cache du navigateur (Ctrl+Shift+Delete)
4. Vérifier les logs :
   ```bash
   grep -i "cors" logs/spring.log
   ```

### Problème 2 : Erreur 401 Unauthorized

**Cause :** Token JWT non envoyé ou expiré

**Solution :**

1. Vérifier que le token est dans localStorage
   ```javascript
   // Dans la console du navigateur
   console.log(localStorage.getItem('atikoUser'));
   ```

2. Se reconnecter si le token a expiré

3. Vérifier que l'intercepteur Axios ajoute le token :
   ```javascript
   // Dans front-office/src/services/api.js
   // Le token doit être ajouté automatiquement
   ```

### Problème 3 : Erreur 403 Forbidden

**Cause :** Endpoint protégé par Spring Security

**Solution :**

1. Vérifier dans `WebSecurityConfig.java` :
   ```java
   .requestMatchers("/api/voitures").permitAll()  // Doit être public
   ```

2. Pour les endpoints authentifiés, vérifier le token JWT

### Problème 4 : Logo ne s'affiche pas

**Solution :** ✅ Déjà résolu - Le logo utilise maintenant une icône SVG

Si vous voulez utiliser votre propre logo :

1. Placer le fichier `logo.png` dans `front-office/public/`
2. Modifier `Navbar.js` :
   ```javascript
   <img src="/logo.png" alt="Atiko Logo" className="w-10 h-10" />
   ```

---

## 🔐 Sécurité en production

### 1. HTTPS obligatoire

```properties
# Forcer HTTPS
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=votre-mot-de-passe
server.ssl.key-store-type=PKCS12
```

### 2. CORS restrictif

```properties
# NE PAS utiliser * en production
app.cors.allowed-origins=https://votre-domaine.com
```

### 3. Variables d'environnement

Ne jamais commiter les secrets dans Git :

```bash
# Utiliser des variables d'environnement
export DB_PASSWORD=votre-mot-de-passe
export JWT_SECRET=votre-secret-jwt
```

Dans `application.properties` :
```properties
spring.datasource.password=${DB_PASSWORD}
security.jwt.secret-key=${JWT_SECRET}
```

---

## ✅ Checklist de déploiement

### Backend

- [ ] Configurer `app.cors.allowed-origins` avec le bon domaine
- [ ] Vérifier la connexion à la base de données
- [ ] Configurer HTTPS (certificat SSL)
- [ ] Configurer les variables d'environnement
- [ ] Tester les endpoints avec Postman
- [ ] Vérifier les logs (pas d'erreurs)

### Frontend

- [ ] Configurer `REACT_APP_API_URL` avec l'URL de l'API
- [ ] Build avec `npm run build`
- [ ] Tester en local avec `serve -s build`
- [ ] Vérifier que le logo s'affiche
- [ ] Tester la connexion à l'API
- [ ] Vérifier les erreurs dans la console

### Tests

- [ ] Inscription d'un utilisateur
- [ ] Connexion
- [ ] Liste des véhicules
- [ ] Création d'une réservation
- [ ] Annulation d'une réservation
- [ ] Formulaire de contact

---

## 📞 Support

Si vous rencontrez toujours des problèmes :

1. **Vérifier les logs du backend**
   ```bash
   tail -f logs/spring.log
   ```

2. **Vérifier la console du navigateur** (F12)

3. **Tester l'API directement**
   ```bash
   curl https://votre-api.com/api/voitures
   ```

4. **Vérifier la configuration CORS**
   ```bash
   curl -H "Origin: https://votre-site.com" \
        -X OPTIONS \
        https://votre-api.com/api/voitures -v
   ```

---

## 🎉 Résumé des modifications

### Fichiers créés
- ✅ `src/main/java/com/example/Atiko/config/CorsConfig.java`
- ✅ `GUIDE_DEPLOIEMENT.md` (ce fichier)

### Fichiers modifiés
- ✅ `front-office/src/components/Navbar.js` (logo SVG)
- ✅ `src/main/java/com/example/Atiko/security/WebSecurityConfig.java` (CORS activé)
- ✅ `src/main/resources/application.properties` (configuration CORS)

### Problèmes résolus
- ✅ Logo ne s'affiche pas → Utilise maintenant une icône SVG
- ✅ Erreur CORS → Configuration CORS complète ajoutée

---

**Bon déploiement ! 🚀**
