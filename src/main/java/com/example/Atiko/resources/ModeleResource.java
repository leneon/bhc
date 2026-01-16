package com.example.Atiko.resources;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.dtos.ModeleDTO;
import com.example.Atiko.services.ModeleService;

import java.util.List;

@RestController
@RequestMapping("/api/modeles")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ModeleResource{

    private final ModeleService modeleService;

    /**
     * Récupérer tous les modèles
     */
    @GetMapping
    public ResponseEntity<List<ModeleDTO>> getAllModeles() {
        log.info("GET /api/modeles - Récupération de tous les modèles");
        try {
            List<ModeleDTO> modeles = modeleService.getAllModeles();
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des modèles", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupérer un modèle par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ModeleDTO> getModeleById(@PathVariable Long id) {
        log.info("GET /api/modeles/{} - Récupération du modèle", id);
        try {
            ModeleDTO modele = modeleService.getModeleById(id);
            return ResponseEntity.ok(modele);
        } catch (IllegalArgumentException e) {
            log.warn("Modèle non trouvé - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du modèle", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Créer un modèle
     */
    @PostMapping
    public ResponseEntity<ModeleDTO> createModele(@RequestBody ModeleDTO modeleDTO) {
        log.info("POST /api/modeles - Création d'un nouveau modèle: {}", modeleDTO.getNom());
        try {
            if (modeleDTO.getNom() == null || modeleDTO.getNom().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            if (modeleDTO.getCategorieId() == null || modeleDTO.getMarqueId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            ModeleDTO createdModele = modeleService.createModele(modeleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdModele);
        } catch (IllegalArgumentException e) {
            log.warn("Erreur de validation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            log.error("Erreur lors de la création du modèle", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mettre à jour un modèle
     */
    @PutMapping("/{id}")
    public ResponseEntity<ModeleDTO> updateModele(@PathVariable Long id, @RequestBody ModeleDTO modeleDTO) {
        log.info("PUT /api/modeles/{} - Mise à jour du modèle", id);
        try {
            ModeleDTO updatedModele = modeleService.updateModele(id, modeleDTO);
            return ResponseEntity.ok(updatedModele);
        } catch (IllegalArgumentException e) {
            log.warn("Modèle non trouvé - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du modèle", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprimer un modèle
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModele(@PathVariable Long id) {
        log.info("DELETE /api/modeles/{} - Suppression du modèle", id);
        try {
            modeleService.deleteModele(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Modèle non trouvé - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression du modèle", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Activer/Désactiver un modèle
     */
    @PutMapping("/disable/{id}")
    public ResponseEntity<ModeleDTO> toggleModeleStatus(@PathVariable Long id) {
        log.info("PUT /api/modeles/disable/{} - Basculement du statut du modèle", id);
        try {
            ModeleDTO modele = modeleService.toggleModeleStatus(id);
            return ResponseEntity.ok(modele);
        } catch (IllegalArgumentException e) {
            log.warn("Modèle non trouvé - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors du basculement du statut", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Rechercher des modèles par nom
     */
    @GetMapping("/search/{nom}")
    public ResponseEntity<List<ModeleDTO>> searchByNom(@PathVariable String nom) {
        log.info("GET /api/modeles/search/{} - Recherche de modèles", nom);
        try {
            List<ModeleDTO> modeles = modeleService.searchByNom(nom);
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            log.error("Erreur lors de la recherche", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupérer les modèles par catégorie
     */
    @GetMapping("/categorie/{categorieId}")
    public ResponseEntity<List<ModeleDTO>> getModelesByCategorie(@PathVariable Long categorieId) {
        log.info("GET /api/modeles/categorie/{} - Récupération des modèles par catégorie", categorieId);
        try {
            List<ModeleDTO> modeles = modeleService.getModelesByCategorie(categorieId);
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupérer les modèles par marque
     */
    @GetMapping("/marque/{marqueId}")
    public ResponseEntity<List<ModeleDTO>> getModelesByMarque(@PathVariable Long marqueId) {
        log.info("GET /api/modeles/marque/{} - Récupération des modèles par marque", marqueId);
        try {
            List<ModeleDTO> modeles = modeleService.getModelesByMarque(marqueId);
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}