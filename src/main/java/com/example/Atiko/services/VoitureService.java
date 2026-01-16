package com.example.Atiko.services;

import com.example.Atiko.dtos.ImageVoitureDto;
import com.example.Atiko.dtos.ModeleDTO;
import com.example.Atiko.dtos.VoitureDto;
import com.example.Atiko.entities.ImageVoiture;
import com.example.Atiko.entities.Modele;
import com.example.Atiko.entities.Voiture;
import com.example.Atiko.repositories.ImageVoitureRepository;
import com.example.Atiko.repositories.VoitureRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VoitureService {

    private final VoitureRepository voitureRepository;
    private final ModeleService modeleService;
    private final FileStorageService fileStorageService;
    private final ImageVoitureRepository imageVoitureRepository;


    // ======================================================
    //                       CRUD
    // ======================================================

    public VoitureDto getVoitureById(Long id) {
        Voiture v = voitureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voiture non trouvée"));
        return convertToDTO(v);
    }

    public List<VoitureDto> getAllVoitures() {
        return voitureRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VoitureDto createVoiture(VoitureDto dto, MultipartFile image, MultipartFile[] images) {
        log.info("Création voiture : {}", dto.getNom());

        Voiture voiture = convertToEntity(dto);

        // Sauvegarde image principale
        if (image != null && !image.isEmpty()) {
            voiture.setImage(fileStorageService.storeFile(image,"voitures"));
        }
        System.out.println("\n\n Voiture à sauvegarder: " + voiture.toString() + "\n\n");
        // voiture.setStatut(true);
        
        voiture = voitureRepository.save(voiture);

        // Sauvegarde images supplémentaires
        if (images != null && images.length > 0) {
            for (MultipartFile mf : images) {
                if (!mf.isEmpty()) {
                    ImageVoiture img = new ImageVoiture( voiture, fileStorageService.storeFile(mf,"voitures"));
                    imageVoitureRepository.save(img);
                }
            }
        }

        return convertToDTO(voitureRepository.save(voiture));
    }

   public VoitureDto updateVoiture(Long id, VoitureDto dto, MultipartFile image, MultipartFile[] images) {

    Voiture voiture = voitureRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Voiture non trouvée"));

    // --- MISE À JOUR DES CHAMPS ---
    if (dto.getNom() != null) voiture.setNom(dto.getNom());
    if (dto.getImmatriculation() != null) voiture.setImmatriculation(dto.getImmatriculation());
    if (dto.getAutomatique() != null) voiture.setAutomatique(dto.getAutomatique());
    if (dto.getSiege() != null) voiture.setSiege(dto.getSiege());
    if (dto.getPortiere() != null) voiture.setPortiere(dto.getPortiere());
    if (dto.getCoffre() != null) voiture.setCoffre(dto.getCoffre());
    if (dto.getClimatisation() != null) voiture.setClimatisation(dto.getClimatisation());
    if (dto.getDisponibilite() != null) voiture.setDisponibilite(dto.getDisponibilite());
    if (dto.getPrix() != null) voiture.setPrix(dto.getPrix());
    if (dto.getAcompte() != null) voiture.setAcompte(dto.getAcompte());
    if (dto.getModeleId() != null) voiture.setModele(new Modele(dto.getModeleId()));

    // Carte grise
    if (dto.getNumeroCarteGrise() != null) voiture.setNumeroCarteGrise(dto.getNumeroCarteGrise());
    if (dto.getNumeroSerieVin() != null) voiture.setNumeroSerieVin(dto.getNumeroSerieVin());
    if (dto.getDatePremiereMiseEnCirculation() != null)
        voiture.setDatePremiereMiseEnCirculation(dto.getDatePremiereMiseEnCirculation());
    if (dto.getGenreNational() != null) voiture.setGenreNational(dto.getGenreNational());
    if (dto.getCouleur() != null) voiture.setCouleur(dto.getCouleur());
    if (dto.getPoidsVide() != null) voiture.setPoidsVide(dto.getPoidsVide());
    if (dto.getPoidsTotalAutorise() != null) voiture.setPoidsTotalAutorise(dto.getPoidsTotalAutorise());
    if (dto.getNombrePlaces() != null) voiture.setNombrePlaces(dto.getNombrePlaces());
    if (dto.getProprietaire() != null) voiture.setProprietaire(dto.getProprietaire());
    if (dto.getAdresseProprietaire() != null) voiture.setAdresseProprietaire(dto.getAdresseProprietaire());
    if (dto.getDateDelivranceCarteGrise() != null) voiture.setDateDelivranceCarteGrise(dto.getDateDelivranceCarteGrise());
    if (dto.getCentreImmatriculation() != null) voiture.setCentreImmatriculation(dto.getCentreImmatriculation());

    // --- MISE À JOUR IMAGE PRINCIPALE ---
    if (image != null && !image.isEmpty()) {
        voiture.setImage(fileStorageService.storeFile(image,"voitures"));
    }

    // Sauvegarde voiture après MAJ champs & image principale
    voiture = voitureRepository.save(voiture);

    // --- AJOUT DES IMAGES SUPPLÉMENTAIRES ---
    if (images != null && images.length > 0) {
        for (MultipartFile mf : images) {
            if (mf != null && !mf.isEmpty()) {
                ImageVoiture img = new ImageVoiture(voiture, fileStorageService.storeFile(mf,"voitures"));
                imageVoitureRepository.save(img);
            }
        }
    }

    return convertToDTO(voiture);
}

    public void deleteVoiture(Long id) {
        voitureRepository.deleteById(id);
    }

    public VoitureDto toggleVoitureStatus(Long id) {
        Voiture v = voitureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voiture non trouvée"));

        v.setStatut(!v.getStatut());
        return convertToDTO(voitureRepository.save(v));
    }

    // ======================================================
    //            RECHERCHE & FILTRES
    // ======================================================

    public List<VoitureDto> searchByNom(String nom) {
        return voitureRepository.findByNomContainingIgnoreCase(nom)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<VoitureDto> getVoituresByModele(Long modeleId) {
        return voitureRepository.findByModeleId(modeleId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ======================================================
    //                CONVERTISSEURS
    // ======================================================

    private VoitureDto convertToDTO(Voiture v) {
        VoitureDto dto = new VoitureDto();

        dto.setId(v.getId());
        dto.setNom(v.getNom());
        dto.setImmatriculation(v.getImmatriculation());
        dto.setAutomatique(v.getAutomatique());
        dto.setSiege(v.getSiege());
        dto.setPortiere(v.getPortiere());
        dto.setCoffre(v.getCoffre());
        dto.setClimatisation(v.getClimatisation());
        dto.setDisponibilite(v.getDisponibilite());
        dto.setStatut(v.getStatut());
        dto.setImage(v.getImage());
        dto.setPrix(v.getPrix());
        dto.setAcompte(v.getAcompte());
        dto.setModele(new ModeleDTO(v.getModele()));
        // Modele
        if (v.getModele() != null) {
            dto.setModeleId(v.getModele().getId());
            try {
                dto.setModele(modeleService.getModeleById(v.getModele().getId()));
            } catch (Exception ignored) {}
        }

        // Images secondaires
        if (v.getImages() != null) {
            dto.setImages(
                v.getImages()
                        .stream()
                        .map(img -> new ImageVoitureDto(img.getUrl(), v.getId()))
                        .collect(Collectors.toList())
            );
        }

        // Carte grise
        dto.setNumeroCarteGrise(v.getNumeroCarteGrise());
        dto.setNumeroSerieVin(v.getNumeroSerieVin());
        dto.setDatePremiereMiseEnCirculation(v.getDatePremiereMiseEnCirculation());
        dto.setGenreNational(v.getGenreNational());
        // dto.setEnergie(v.getEnergie());
        dto.setCouleur(v.getCouleur());
        dto.setPoidsVide(v.getPoidsVide());
        dto.setPoidsTotalAutorise(v.getPoidsTotalAutorise());
        dto.setNombrePlaces(v.getNombrePlaces());
        dto.setProprietaire(v.getProprietaire());
        dto.setAdresseProprietaire(v.getAdresseProprietaire());
        dto.setDateDelivranceCarteGrise(v.getDateDelivranceCarteGrise());
        dto.setCentreImmatriculation(v.getCentreImmatriculation());

        return dto;
    }

    private Voiture convertToEntity(VoitureDto dto) {
        Voiture v = new Voiture();

        v.setNom(dto.getNom());
        v.setImmatriculation(dto.getImmatriculation());
        v.setAutomatique(dto.getAutomatique());
        v.setSiege(dto.getSiege());
        v.setPortiere(dto.getPortiere());
        v.setCoffre(dto.getCoffre());
        v.setClimatisation(dto.getClimatisation());
        v.setDisponibilite(dto.getDisponibilite());
        v.setPrix(dto.getPrix());
        v.setAcompte(dto.getAcompte());
        v.setStatut(dto.getStatut());

        if (dto.getModeleId() != null)
            v.setModele(new Modele(dto.getModeleId()));

        // Carte grise
        v.setNumeroCarteGrise(dto.getNumeroCarteGrise());
        v.setNumeroSerieVin(dto.getNumeroSerieVin());
        v.setDatePremiereMiseEnCirculation(dto.getDatePremiereMiseEnCirculation());
        v.setGenreNational(dto.getGenreNational());
        // v.setEnergie(dto.getEnergie());
        v.setCouleur(dto.getCouleur());
        v.setPoidsVide(dto.getPoidsVide());
        v.setPoidsTotalAutorise(dto.getPoidsTotalAutorise());
        v.setNombrePlaces(dto.getNombrePlaces());
        v.setProprietaire(dto.getProprietaire());
        v.setAdresseProprietaire(dto.getAdresseProprietaire());
        v.setDateDelivranceCarteGrise(dto.getDateDelivranceCarteGrise());
        v.setCentreImmatriculation(dto.getCentreImmatriculation());

        return v;
    }
}
