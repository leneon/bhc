# 🔍 Diagnostic : Aucun véhicule disponible

## Problème

Le message "Aucun véhicule disponible pour le moment" s'affiche car le filtre suivant ne trouve aucun véhicule :

```javascript
.filter(v => v.statut && v.disponibilite === 'disponible')
```

## Causes possibles

### 1. Aucun véhicule en base de données

**Vérification :**
```sql
SELECT COUNT(*) FROM voiture;
```

**Si 0 véhicule :**
- Ajouter des véhicules via le back-office
- Ou insérer des données de test

### 2. Véhicules avec statut = false

**Vérification :**
```sql
SELECT id, nom, statut, disponibilite FROM voiture;
```

**Si statut = false :**
```sql
UPDATE voiture SET statut = true WHERE id IN (1, 2, 3);
```

### 3. Disponibilité différente de 'disponible'

**Vérification :**
```sql
SELECT DISTINCT disponibilite FROM voiture;
```

**Valeurs possibles :**
- `'disponible'` ✅ (attendu)
- `'DISPONIBLE'` ❌ (majuscules)
- `'indisponible'` ❌
- `NULL` ❌

**Correction :**
```sql
UPDATE voiture SET disponibilite = 'disponible' WHERE disponibilite IS NULL OR disponibilite != 'disponible';
```

### 4. Backend non démarré

**Vérification :**
```bash
curl http://localhost:8081/api/voitures
```

**Si erreur :**
- Démarrer le backend : `cd Atiko && mvn spring-boot:run`

### 5. Erreur CORS

**Vérification :**
- Ouvrir la console du navigateur (F12)
- Regarder les erreurs réseau

**Si erreur CORS :**
- Vérifier `@CrossOrigin` dans les controllers backend

## Solutions rapides

### Solution 1 : Vérifier les données en BDD

```sql
-- Voir tous les véhicules
SELECT id, nom, statut, disponibilite FROM voiture;

-- Activer tous les véhicules
UPDATE voiture SET statut = true, disponibilite = 'disponible';
```

### Solution 2 : Modifier temporairement le filtre

Éditer `front-office/src/pages/HomePage.js` et `CarRentalPage.js` :

**AVANT :**
```javascript
.filter(v => v.statut && v.disponibilite === 'disponible')
```

**APRÈS (temporaire pour debug) :**
```javascript
.filter(v => v.statut !== false) // Accepte true et null
```

Ou encore plus permissif :
```javascript
// Pas de filtre du tout pour voir tous les véhicules
// .filter(v => v.statut && v.disponibilite === 'disponible')
```

### Solution 3 : Ajouter des logs de debug

Éditer `front-office/src/pages/HomePage.js` :

```javascript
const loadPopularCars = async () => {
  try {
    const result = await voitureService.getAllVoitures();
    
    console.log('=== DEBUG VEHICULES ===');
    console.log('API Success:', result.success);
    console.log('Total véhicules:', result.data?.length || 0);
    console.log('Données brutes:', result.data);
    
    if (result.success) {
      console.log('Véhicules avant filtre:', result.data);
      
      const filtered = result.data.filter(v => {
        console.log(`Véhicule ${v.id}:`, {
          nom: v.nom,
          statut: v.statut,
          disponibilite: v.disponibilite,
          passe: v.statut && v.disponibilite === 'disponible'
        });
        return v.statut && v.disponibilite === 'disponible';
      });
      
      console.log('Véhicules après filtre:', filtered.length);
      
      const transformedCars = filtered
        .map(v => voitureService.transformVoitureForDisplay(v))
        .slice(0, 3);
      setPopularCars(transformedCars);
    }
  } catch (error) {
    console.error('Error loading popular cars:', error);
  } finally {
    setLoading(false);
  }
};
```

Puis ouvrir la console du navigateur (F12) et regarder les logs.

### Solution 4 : Désactiver temporairement le filtre

Créer un fichier `front-office/src/pages/HomePageDebug.js` :

```javascript
import React from 'react';
import { voitureService } from '@/services/voitureService';

export default function HomePage() {
  const [popularCars, setPopularCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [debug, setDebug] = React.useState(null);

  React.useEffect(() => {
    loadPopularCars();
  }, []);

  const loadPopularCars = async () => {
    try {
      const result = await voitureService.getAllVoitures();
      
      setDebug({
        success: result.success,
        totalCount: result.data?.length || 0,
        data: result.data,
        error: result.error
      });
      
      if (result.success) {
        // SANS FILTRE pour debug
        const transformedCars = result.data
          .map(v => voitureService.transformVoitureForDisplay(v))
          .slice(0, 3);
        setPopularCars(transformedCars);
      }
    } catch (error) {
      console.error('Error loading popular cars:', error);
      setDebug({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Véhicules</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold">Informations API :</h2>
        <pre>{JSON.stringify(debug, null, 2)}</pre>
      </div>
      
      <div>
        <h2 className="font-bold mb-2">Véhicules chargés : {popularCars.length}</h2>
        {popularCars.map(car => (
          <div key={car.id} className="border p-4 mb-2">
            <p><strong>ID:</strong> {car.id}</p>
            <p><strong>Nom:</strong> {car.name}</p>
            <p><strong>Prix:</strong> {car.price}</p>
            <p><strong>Statut:</strong> {car.statut ? 'Actif' : 'Inactif'}</p>
            <p><strong>Disponibilité:</strong> {car.disponibilite}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Checklist de diagnostic

- [ ] Backend démarré sur port 8081
- [ ] `curl http://localhost:8081/api/voitures` retourne des données
- [ ] Base de données contient des véhicules
- [ ] Véhicules ont `statut = true`
- [ ] Véhicules ont `disponibilite = 'disponible'` (minuscules)
- [ ] Pas d'erreur CORS dans la console
- [ ] Frontend peut se connecter au backend

## Script SQL de test

```sql
-- Créer un véhicule de test si aucun n'existe
INSERT INTO voiture (nom, prix, statut, disponibilite, automatique, siege, portiere, climatisation)
VALUES ('Voiture Test', 50000, true, 'disponible', true, 5, 4, true);

-- Ou activer tous les véhicules existants
UPDATE voiture 
SET statut = true, 
    disponibilite = 'disponible' 
WHERE statut IS NULL OR statut = false OR disponibilite IS NULL OR disponibilite != 'disponible';

-- Vérifier le résultat
SELECT id, nom, statut, disponibilite FROM voiture;
```

## Commandes de diagnostic

```bash
# 1. Vérifier que le backend tourne
curl http://localhost:8081/api/voitures

# 2. Vérifier avec authentification si nécessaire
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8081/api/voitures

# 3. Voir les logs du backend
tail -f logs/spring.log

# 4. Redémarrer le backend
cd Atiko
mvn clean spring-boot:run
```

## Prochaines étapes

1. Exécuter les requêtes SQL ci-dessus
2. Vérifier que des véhicules existent avec les bons statuts
3. Redémarrer le backend
4. Rafraîchir le frontend (Ctrl+F5)
5. Ouvrir la console du navigateur pour voir les erreurs
6. Tester l'endpoint API directement avec curl

Si le problème persiste après ces vérifications, le problème vient probablement de la base de données qui ne contient pas de véhicules ou qui a des valeurs incorrectes pour `statut` et `disponibilite`.
