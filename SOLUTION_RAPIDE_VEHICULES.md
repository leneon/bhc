# 🔧 Solution Rapide : Aucun véhicule disponible

## 🎯 Actions immédiates

### 1. Ouvrir la console du navigateur

1. Appuyer sur **F12** dans le navigateur
2. Aller sur l'onglet **Console**
3. Rafraîchir la page (**Ctrl + F5**)
4. Regarder les logs qui commencent par 🚗

Vous devriez voir :
```
🚗 [HomePage] Chargement des véhicules
✅ Success: true/false
📊 Total véhicules reçus: X
```

### 2. Vérifier la base de données

Ouvrir pgAdmin ou un client PostgreSQL et exécuter :

```sql
-- Voir tous les véhicules
SELECT id, nom, statut, disponibilite 
FROM voiture;
```

**Si aucun résultat :** Aucun véhicule en base → Voir section "Ajouter des véhicules"

**Si des véhicules existent :** Vérifier les colonnes `statut` et `disponibilite`

### 3. Corriger les statuts

```sql
-- Activer TOUS les véhicules
UPDATE voiture 
SET statut = true, 
    disponibilite = 'disponible';

-- Vérifier
SELECT id, nom, statut, disponibilite 
FROM voiture;
```

### 4. Rafraîchir le frontend

Appuyer sur **Ctrl + F5** dans le navigateur pour recharger complètement la page.

---

## 📋 Ajouter des véhicules de test

Si vous n'avez AUCUN véhicule en base, exécutez ce script SQL :

```sql
-- 1. Créer une marque
INSERT INTO marque (nom, description, date_creation) 
VALUES ('Toyota', 'Constructeur japonais', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 2. Créer un modèle
INSERT INTO modele (nom, marque_id, date_creation)
SELECT 'Corolla', id, CURRENT_TIMESTAMP
FROM marque 
WHERE nom = 'Toyota'
ON CONFLICT DO NOTHING;

-- 3. Créer des véhicules
INSERT INTO voiture (
    nom, 
    immatriculation, 
    automatique, 
    siege, 
    portiere, 
    climatisation, 
    disponibilite, 
    statut, 
    prix, 
    acompte, 
    modele_id
)
SELECT 
    'Toyota Corolla 2023',
    'DK-1234-AB',
    true,
    5,
    4,
    true,
    'disponible',
    true,
    35000,
    10000,
    id
FROM modele 
WHERE nom = 'Corolla'
ON CONFLICT DO NOTHING;

INSERT INTO voiture (
    nom, 
    immatriculation, 
    automatique, 
    siege, 
    portiere, 
    climatisation, 
    disponibilite, 
    statut, 
    prix, 
    acompte, 
    modele_id
)
SELECT 
    'Toyota Corolla 2024',
    'DK-5678-CD',
    true,
    5,
    4,
    true,
    'disponible',
    true,
    40000,
    12000,
    id
FROM modele 
WHERE nom = 'Corolla'
ON CONFLICT DO NOTHING;

-- Vérifier
SELECT v.id, v.nom, v.statut, v.disponibilite, v.prix, m.nom as modele, ma.nom as marque
FROM voiture v
LEFT JOIN modele m ON v.modele_id = m.id
LEFT JOIN marque ma ON m.marque_id = ma.id;
```

---

## 🔍 Diagnostic selon les logs

### Cas 1 : "Total véhicules reçus: 0"

**Problème :** Le backend ne retourne aucun véhicule

**Solutions :**
1. Vérifier que le backend est démarré
2. Tester l'endpoint : `curl http://localhost:8081/api/voitures`
3. Ajouter des véhicules en base (voir script ci-dessus)

### Cas 2 : "Total véhicules reçus: X" mais "Véhicules après filtre: 0"

**Problème :** Les véhicules ne passent pas le filtre

**Dans les logs, regarder pour chaque véhicule :**
```
Véhicule 1: {
  nom: "Toyota Corolla",
  statut: false,              ← Doit être true
  disponibilite: "indisponible", ← Doit être "disponible"
  Passe le filtre?: false
}
```

**Solutions :**
```sql
-- Si statut = false
UPDATE voiture SET statut = true WHERE statut = false;

-- Si disponibilite != 'disponible'
UPDATE voiture SET disponibilite = 'disponible' WHERE disponibilite != 'disponible';
```

### Cas 3 : "Success: false"

**Problème :** Erreur de connexion au backend

**Solutions :**
1. Vérifier que le backend tourne : `curl http://localhost:8081/api/voitures`
2. Vérifier les logs du backend
3. Vérifier le fichier `.env` : `REACT_APP_API_URL=http://localhost:8081`

### Cas 4 : Erreur CORS

**Dans la console, si vous voyez :**
```
Access to XMLHttpRequest at 'http://localhost:8081/api/voitures' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution :**
Vérifier que le backend a `@CrossOrigin` dans les controllers :
```java
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/voitures")
public class VoitureResource {
    // ...
}
```

---

## ⚡ Solution temporaire (pour tester)

Si vous voulez voir TOUS les véhicules sans filtre (pour debug), modifiez temporairement :

**Dans `HomePage.js` et `CarRentalPage.js`, remplacez :**

```javascript
const filtered = result.data.filter(v => v.statut && v.disponibilite === 'disponible');
```

**Par :**

```javascript
// TEMPORAIRE : Afficher tous les véhicules
const filtered = result.data; // Pas de filtre
```

Puis rafraîchissez la page. Si les véhicules apparaissent, le problème vient bien des valeurs de `statut` et `disponibilite` en base.

**⚠️ N'oubliez pas de remettre le filtre après !**

---

## ✅ Checklist de vérification

- [ ] Backend démarré sur port 8081
- [ ] `curl http://localhost:8081/api/voitures` retourne des données JSON
- [ ] Base de données contient au moins 1 véhicule
- [ ] Tous les véhicules ont `statut = true`
- [ ] Tous les véhicules ont `disponibilite = 'disponible'` (minuscules)
- [ ] Pas d'erreur dans la console du navigateur (F12)
- [ ] Frontend rafraîchi (Ctrl + F5)

---

## 🆘 Si rien ne fonctionne

1. **Copier les logs de la console** (F12 → Console)
2. **Copier le résultat de cette requête SQL :**
   ```sql
   SELECT id, nom, statut, disponibilite FROM voiture;
   ```
3. **Copier le résultat de cette commande :**
   ```bash
   curl http://localhost:8081/api/voitures
   ```

Et partager ces informations pour un diagnostic plus précis.

---

## 📞 Commandes utiles

```bash
# Tester l'API backend
curl http://localhost:8081/api/voitures

# Voir les logs du backend
tail -f logs/spring.log

# Redémarrer le backend
cd Atiko
mvn clean spring-boot:run

# Redémarrer le frontend
cd front-office
npm start
```

---

**💡 Dans 99% des cas, le problème vient de :**
1. Aucun véhicule en base de données
2. `statut = false` ou `statut = NULL`
3. `disponibilite != 'disponible'` ou `disponibilite = NULL`

**Exécutez simplement ce script SQL pour corriger :**

```sql
UPDATE voiture 
SET statut = true, 
    disponibilite = 'disponible'
WHERE statut IS NULL 
   OR statut = false 
   OR disponibilite IS NULL 
   OR disponibilite != 'disponible';
```

Puis rafraîchissez le navigateur ! 🎉
