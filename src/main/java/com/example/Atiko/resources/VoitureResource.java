package com.example.Atiko.resources;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.VoitureDto;
import com.example.Atiko.services.VoitureService;

import java.util.List;

@RestController
@RequestMapping("/api/voitures")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class VoitureResource {

    private final VoitureService voitureService;

    /**
     * Récupérer toutes les voitures
     */
    @GetMapping
    public ResponseEntity<List<VoitureDto>> getAllVoitures() {
        log.info("GET /api/voitures - Récupération de toutes les voitures");
        try {
            List<VoitureDto> voitures = voitureService.getAllVoitures();
            return ResponseEntity.ok(voitures);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des voitures", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupérer une voiture par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VoitureDto> getVoitureById(@PathVariable Long id) {
        log.info("GET /api/voitures/{} - Récupération de la voiture", id);
        try {
            VoitureDto voiture = voitureService.getVoitureById(id);
            return ResponseEntity.ok(voiture);
        } catch (IllegalArgumentException e) {
            log.warn("Voiture non trouvée - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la voiture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

@PostMapping(consumes = {"multipart/form-data"})
public ResponseEntity<VoitureDto> createVoiture(
        @RequestPart("voiture") VoitureDto voitureDto,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @RequestPart(value = "images", required = false) MultipartFile[] images) {

    System.out.println("\n\n POST /api/voitures - Création d'une nouvelle voiture: " + voitureDto.getNom() + "\n\n");
    try {
        if (voitureDto.getNom() == null || voitureDto.getNom().trim().isEmpty() ||
            voitureDto.getModeleId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        VoitureDto createdVoiture = voitureService.createVoiture(voitureDto, image, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVoiture);
    } catch (IllegalArgumentException e) {
        log.warn("Erreur de validation: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    } catch (Exception e) {
        log.error("Erreur lors de la création de la voiture", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


    /**
     * Mettre à jour une voiture
     */
    @PutMapping(path = "/{id}", consumes = {"multipart/form-data"})
public ResponseEntity<VoitureDto> updateVoiture(
        @PathVariable Long id,
        @RequestPart("voiture") VoitureDto voitureDto,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @RequestPart(value = "images", required = false) MultipartFile[] images) {        
            
            log.info("PUT /api/voitures/{} - Mise à jour de la voiture", id);
        try {
            VoitureDto updatedVoiture = voitureService.updateVoiture(id, voitureDto, image, images);
            return ResponseEntity.ok(updatedVoiture);
        } catch (IllegalArgumentException e) {
            log.warn("Voiture non trouvée - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de la voiture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprimer une voiture
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoiture(@PathVariable Long id) {
        log.info("DELETE /api/voitures/{} - Suppression de la voiture", id);
        try {
            voitureService.deleteVoiture(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Voiture non trouvée - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression de la voiture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Activer/Désactiver une voiture
     */
    @PutMapping("/disable/{id}")
    public ResponseEntity<VoitureDto> toggleVoitureStatus(@PathVariable Long id) {
        log.info("PUT /api/voitures/disable/{} - Basculement du statut de la voiture", id);
        try {
            VoitureDto voiture = voitureService.toggleVoitureStatus(id);
            return ResponseEntity.ok(voiture);
        } catch (IllegalArgumentException e) {
            log.warn("Voiture non trouvée - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors du basculement du statut", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Rechercher des voitures par nom
     */
    @GetMapping("/search/{nom}")
    public ResponseEntity<List<VoitureDto>> searchByNom(@PathVariable String nom) {
        log.info("GET /api/voitures/search/{} - Recherche de voitures", nom);
        try {
            List<VoitureDto> voitures = voitureService.searchByNom(nom);
            return ResponseEntity.ok(voitures);
        } catch (Exception e) {
            log.error("Erreur lors de la recherche", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupérer les voitures par modèle
     */
    @GetMapping("/modele/{modeleId}")
    public ResponseEntity<List<VoitureDto>> getVoituresByModele(@PathVariable Long modeleId) {
        log.info("GET /api/voitures/modele/{} - Récupération des voitures par modèle", modeleId);
        try {
            List<VoitureDto> voitures = voitureService.getVoituresByModele(modeleId);
            return ResponseEntity.ok(voitures);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
