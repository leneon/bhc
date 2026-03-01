# 🚨 Solution rapide - Problème CORS

## ⚡ Résolution immédiate

### 1️⃣ Modifier `application.properties`

Ouvrez `src/main/resources/application.properties` et ajoutez à la fin :

```properties
# Configuration CORS - Remplacez par votre nom de domaine
app.cors.allowed-origins=https://votre-domaine.com,https://www.votre-domaine.com
```

**Exemples selon votre hébergement :**

```properties
# Si votre site est sur atiko.sn
app.cors.allowed-origins=https://atiko.sn,https://www.atiko.sn

# Si vous utilisez Vercel
app.cors.allowed-origins=https://atiko.vercel.app

# Si vous utilisez Netlify
app.cors.allowed-origins=https://atiko.netlify.app

# Si vous utilisez Heroku
app.cors.allowed-origins=https://atiko.herokuapp.com

# Pour tester (TEMPORAIRE SEULEMENT)
app.cors.allowed-origins=*
```

### 2️⃣ Redémarrer le backend

```bash
# Arrêter le backend (Ctrl+C)
# Puis redémarrer
cd Atiko
mvn spring-boot:run
```

### 3️⃣ Vider le cache du navigateur

1. Ouvrir votre site
2. Appuyer sur `Ctrl + Shift + Delete`
3. Cocher "Cache" et "Cookies"
4. Cliquer sur "Effacer"
5. Recharger la page (`F5`)

---

## 🔍 Vérifier que ça fonctionne

### Dans le navigateur

1. Ouvrir la console (F12)
2. Onglet "Network"
3. Recharger la page
4. Chercher les requêtes vers `/api/voitures`
5. Vérifier qu'il n'y a plus d'erreur CORS

### Avec curl

```bash
# Remplacez par votre domaine
curl -H "Origin: https://votre-domaine.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://votre-api.com/api/voitures -v
```

Vous devriez voir dans la réponse :
```
Access-Control-Allow-Origin: https://votre-domaine.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## 📝 Configuration complète

### Pour le développement local

```properties
app.cors.allowed-origins=http://localhost:3000,http://localhost:8081
```

### Pour la production

```properties
# Listez TOUS vos domaines séparés par des virgules
app.cors.allowed-origins=https://votre-domaine.com,https://www.votre-domaine.com,https://api.votre-domaine.com
```

---

## 🐛 Si ça ne fonctionne toujours pas

### Vérification 1 : Le fichier CorsConfig.java existe

```bash
# Vérifier que le fichier existe
ls src/main/java/com/example/Atiko/config/CorsConfig.java
```

Si le fichier n'existe pas, il a été créé dans les modifications précédentes.

### Vérification 2 : Les logs du backend

```bash
# Regarder les logs pour voir les erreurs
tail -f logs/spring.log
```

### Vérification 3 : Le frontend utilise la bonne URL

Dans `front-office/.env` :
```env
REACT_APP_API_URL=https://votre-api.com
```

Puis rebuild le frontend :
```bash
cd front-office
npm run build
```

---

## 🎯 Checklist rapide

- [ ] ✅ Fichier `CorsConfig.java` créé
- [ ] ✅ `application.properties` modifié avec votre domaine
- [ ] ✅ Backend redémarré
- [ ] ✅ Cache du navigateur vidé
- [ ] ✅ Pas d'erreur CORS dans la console
- [ ] ✅ Les véhicules s'affichent
- [ ] ✅ La connexion fonctionne

---

## 💡 Astuce pour le déploiement

### Variables d'environnement (recommandé)

Au lieu de modifier `application.properties`, utilisez des variables d'environnement :

```bash
# Linux/Mac
export CORS_ORIGINS=https://votre-domaine.com

# Windows
set CORS_ORIGINS=https://votre-domaine.com

# Puis démarrer le backend
java -jar target/Atiko-0.0.1-SNAPSHOT.jar
```

Dans `application.properties` :
```properties
app.cors.allowed-origins=${CORS_ORIGINS:*}
```

---

## 🚀 Déploiement rapide

### 1. Backend

```bash
cd Atiko

# Modifier application.properties avec votre domaine
nano src/main/resources/application.properties
# Changer : app.cors.allowed-origins=https://votre-domaine.com

# Build
mvn clean package -DskipTests

# Déployer
java -jar target/Atiko-0.0.1-SNAPSHOT.jar
```

### 2. Frontend

```bash
cd front-office

# Modifier .env.production avec l'URL de votre API
echo "REACT_APP_API_URL=https://votre-api.com" > .env.production

# Build
npm run build

# Les fichiers sont dans build/ - déployez-les sur votre serveur
```

---

## 📞 Besoin d'aide ?

Si le problème persiste après ces étapes :

1. **Vérifier les logs du backend**
   ```bash
   grep -i "cors\|error" logs/spring.log
   ```

2. **Vérifier la console du navigateur** (F12)
   - Onglet "Console" pour les erreurs JavaScript
   - Onglet "Network" pour les requêtes HTTP

3. **Tester l'API directement**
   ```bash
   curl https://votre-api.com/api/voitures
   ```

4. **Consulter le guide complet**
   - Voir `GUIDE_DEPLOIEMENT.md` pour plus de détails

---

## ✅ Résumé

**Problème** : CORS bloque les requêtes après déploiement

**Solution** :
1. ✅ Fichier `CorsConfig.java` créé
2. ✅ Configuration dans `application.properties`
3. ✅ Redémarrer le backend
4. ✅ Vider le cache du navigateur

**Résultat** : Les requêtes API fonctionnent maintenant ! 🎉
