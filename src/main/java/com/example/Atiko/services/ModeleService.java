package com.example.Atiko.services;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Atiko.dtos.ModeleDTO;
import com.example.Atiko.entities.Categorie;
import com.example.Atiko.entities.Marque;
import com.example.Atiko.entities.Modele;
import com.example.Atiko.repositories.ModeleRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ModeleService {

    private final ModeleRepository modeleRepository;
    private final CategorieService categorieService;
    private final MarqueService marqueService;

    /**
     * Récupérer tous les modèles
     */
    public List<ModeleDTO> getAllModeles() {
        log.info("Récupération de tous les modèles");
        return modeleRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un modèle par ID
     */
    public ModeleDTO getModeleById(Long id) {
        log.info("Recherche du modèle avec l'ID: {}", id);
        return modeleRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new IllegalArgumentException("Modèle non trouvé"));
    }

    /**
     * Créer un modèle
     */
    public ModeleDTO createModele(ModeleDTO modeleDTO) {
        log.info("Création d'un nouveau modèle: {}", modeleDTO.getNom());
        
        if (modeleRepository.existsByNomAndCategorieId(modeleDTO.getNom(), modeleDTO.getCategorieId())) {
            throw new IllegalArgumentException("Ce modèle existe déjà dans cette catégorie");
        }

        Modele modele = convertToEntity(modeleDTO);
        modele.setStatut(true);
        
        Modele savedModele = modeleRepository.save(modele);
        log.info("Modèle créé avec succès - ID: {}", savedModele.getId());
        
        return convertToDTO(savedModele);
    }

    /**
     * Mettre à jour un modèle
     */
    public ModeleDTO updateModele(Long id, ModeleDTO modeleDTO) {
        log.info("Mise à jour du modèle avec l'ID: {}", id);
        
        Modele modele = modeleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Modèle non trouvé"));

        if (modeleDTO.getNom() != null) {
            modele.setNom(modeleDTO.getNom());
        }
        if (modeleDTO.getAnneeSortie() != null) {
            modele.setAnneeSortie(modeleDTO.getAnneeSortie());
        }
        if (modeleDTO.getTypeMoteur() != null) {
            modele.setTypeMoteur(modeleDTO.getTypeMoteur());
        }
        if (modeleDTO.getPuissance() != null) {
            modele.setPuissance(modeleDTO.getPuissance());
        }
        if (modeleDTO.getDescription() != null) {
            modele.setDescription(modeleDTO.getDescription());
        }
        if (modeleDTO.getCategorieId() != null) {
            modele.setCategorie(new Categorie(modeleDTO.getCategorieId()));
        }
        if (modeleDTO.getMarqueId() != null) {
            modele.setMarque(new Marque(modeleDTO.getMarqueId()));
        }
        if (modeleDTO.getStatut() != null) {
            modele.setStatut(modeleDTO.getStatut());
        }

        Modele updatedModele = modeleRepository.save(modele);
        log.info("Modèle mis à jour avec succès - ID: {}", id);
        
        return convertToDTO(updatedModele);
    }

    /**
     * Supprimer un modèle
     */
    public void deleteModele(Long id) {
        log.info("Suppression du modèle avec l'ID: {}", id);
        
        if (!modeleRepository.existsById(id)) {
            throw new IllegalArgumentException("Modèle non trouvé");
        }
        
        modeleRepository.deleteById(id);
        log.info("Modèle supprimé avec succès - ID: {}", id);
    }

    /**
     * Désactiver/Activer un modèle
     */
    public ModeleDTO toggleModeleStatus(Long id) {
        log.info("Basculement du statut du modèle - ID: {}", id);
        
        Modele modele = modeleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Modèle non trouvé"));

        modele.setStatut(!modele.getStatut());
        Modele updatedModele = modeleRepository.save(modele);
        
        log.info("Statut du modèle basculé - ID: {}, Nouveau statut: {}", id, updatedModele.getStatut());
        return convertToDTO(updatedModele);
    }

    /**
     * Rechercher par nom
     */
    public List<ModeleDTO> searchByNom(String nom) {
        log.info("Recherche de modèles par nom: {}", nom);
        return modeleRepository.findByNomContainingIgnoreCase(nom)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer les modèles par catégorie
     */
    public List<ModeleDTO> getModelesByCategorie(Long categorieId) {
        log.info("Récupération des modèles pour la catégorie: {}", categorieId);
        return modeleRepository.findByCategorieId(categorieId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer les modèles par marque
     */
    public List<ModeleDTO> getModelesByMarque(Long marqueId) {
        log.info("Récupération des modèles pour la marque: {}", marqueId);
        return modeleRepository.findByMarqueId(marqueId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convertir Entity en DTO
     */
    private ModeleDTO convertToDTO(Modele modele) {
        ModeleDTO dto = new ModeleDTO();
        dto.setId(modele.getId());
        dto.setNom(modele.getNom());
        dto.setAnneeSortie(modele.getAnneeSortie());
        dto.setTypeMoteur(modele.getTypeMoteur());
        dto.setPuissance(modele.getPuissance());
        dto.setDescription(modele.getDescription());
        dto.setStatut(modele.getStatut());
        dto.setCategorieId(modele.getCategorie().getId());
        dto.setMarqueId(modele.getMarque().getId());
        
        // Récupérer les noms de catégorie et marque
        try {
            dto.setCategorieName(modele.getCategorie().getNom());
        } catch (Exception e) {
            log.warn("Catégorie non trouvée - ID: {}", modele.getCategorie().getId());
        }
        
        try {
            dto.setMarqueName(modele.getMarque().getNom());
        } catch (Exception e) {
            log.warn("Marque non trouvée - ID: {}", modele.getMarque().getId());
        }
        
        return dto;
    }

    /**
     * Convertir DTO en Entity
     */
    private Modele convertToEntity(ModeleDTO dto) {
        Modele modele = new Modele();
        modele.setId(dto.getId());
        modele.setNom(dto.getNom());
        modele.setAnneeSortie(dto.getAnneeSortie());
        modele.setTypeMoteur(dto.getTypeMoteur());
        modele.setPuissance(dto.getPuissance());
        modele.setDescription(dto.getDescription());
        modele.setCategorie(new Categorie(dto.getCategorieId()));
        modele.setMarque(new Marque(dto.getMarqueId()));
        return modele;
    }
}