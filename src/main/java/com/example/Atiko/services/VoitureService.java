package com.example.Atiko.services;

import com.example.Atiko.dtos.VoitureDto;
import com.example.Atiko.dtos.CategorieDto;
import com.example.Atiko.entities.Voiture;
import com.example.Atiko.entities.CoffreType;
import com.example.Atiko.entities.Disponibilite;
import com.example.Atiko.repositories.VoitureRepository;
import com.example.Atiko.repositories.CategorieRepository;
import com.example.Atiko.repositories.ImageVoitureRepository;
import com.example.Atiko.entities.ImageVoiture;
import com.example.Atiko.dtos.ImageVoitureDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VoitureService {

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ImageVoitureRepository imageVoitureRepository;


    // Convert Voiture to VoitureDto
    private VoitureDto convertToDto(Voiture voiture) {
        VoitureDto dto = new VoitureDto();
        dto.setId(voiture.getId());
        dto.setNom(voiture.getNom());
        dto.setImmatriculation(voiture.getImmatriculation());
        dto.setModel(voiture.getModel());
        dto.setAutomatique(voiture.getAutomatique());
        dto.setSiege(voiture.getSiege());
        dto.setPortiere(voiture.getPortiere());
        dto.setCoffre(voiture.getCoffre().name());
        dto.setClimatisation(voiture.getClimatisation());
        dto.setDisponibilite(voiture.getDisponibilite().name());
        dto.setStatut(voiture.getStatut());
        dto.setImage(voiture.getImage());
        if (voiture.getCategorie() != null) {
            dto.setCategorie(new CategorieDto(voiture.getCategorie()));
        }
        // Mapping des images multiples
        if (voiture.getImages() != null) {
            dto.setImages(voiture.getImages().stream().map(img -> {
                ImageVoitureDto imgDto = new ImageVoitureDto();
                imgDto.setId(img.getId());
                imgDto.setUrl(img.getUrl());
                imgDto.setVoitureId(voiture.getId());
                return imgDto;
            }).collect(Collectors.toList()));
        }
        dto.setPrix(voiture.getPrix());
        dto.setAcompte(voiture.getAcompte());
        return dto;
    }

    // Convert VoitureDto to Voiture
    private Voiture convertToEntity(VoitureDto dto) {
        Voiture voiture = new Voiture();
        voiture.setId(dto.getId());
        voiture.setNom(dto.getNom());
        voiture.setImmatriculation(dto.getImmatriculation());
        voiture.setModel(dto.getModel());
        voiture.setAutomatique(dto.getAutomatique() != null ? dto.getAutomatique() : false);
        voiture.setSiege(dto.getSiege());
        voiture.setPortiere(dto.getPortiere());
        // Gestion sécurisée du coffre
        if (dto.getCoffre() != null && !dto.getCoffre().trim().isEmpty()) {
            try {
                voiture.setCoffre(CoffreType.valueOf(dto.getCoffre()));
            } catch (IllegalArgumentException e) {
                voiture.setCoffre(CoffreType.MOYEN); // Valeur par défaut
            }
        } else {
            voiture.setCoffre(CoffreType.MOYEN); // Valeur par défaut
        }
        voiture.setClimatisation(dto.getClimatisation() != null ? dto.getClimatisation() : false);
        // Gestion sécurisée de la disponibilité
        if (dto.getDisponibilite() != null && !dto.getDisponibilite().trim().isEmpty()) {
            try {
                voiture.setDisponibilite(Disponibilite.valueOf(dto.getDisponibilite()));
            } catch (IllegalArgumentException e) {
                voiture.setDisponibilite(Disponibilite.DISPONIBLE); // Valeur par défaut
            }
        } else {
            voiture.setDisponibilite(Disponibilite.DISPONIBLE); // Valeur par défaut
        }
        voiture.setStatut(dto.getStatut() != null ? dto.getStatut() : true);
        voiture.setImage(dto.getImage());
        // Gérer la relation avec la catégorie
        if (dto.getCategorie() != null && dto.getCategorie().getId() != null) {
            categorieRepository.findById(dto.getCategorie().getId()).ifPresent(voiture::setCategorie);
        }
        voiture.setPrix(dto.getPrix());
        voiture.setAcompte(dto.getAcompte());
        return voiture;
    }

    public List<VoitureDto> getAllVoitures() {
        return voitureRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<VoitureDto> getVoitureById(Long id) {
        return voitureRepository.findById(id).map(this::convertToDto);
    }

    public VoitureDto createVoiture(VoitureDto voitureDto, MultipartFile image, MultipartFile[] images) {
        Voiture voiture = convertToEntity(voitureDto);
        // Gérer l'image principale
        if (image != null && !image.isEmpty()) {
            String imageName = fileStorageService.storeFile(image);
            voiture.setImage(imageName);
        }
        // Sauvegarder la voiture d'abord pour avoir l'ID
        Voiture savedVoiture = voitureRepository.save(voiture);
        // Gérer les images multiples
        if (images != null && images.length > 0) {
            for (MultipartFile imgFile : images) {
                if (imgFile != null && !imgFile.isEmpty()) {
                    String url = fileStorageService.storeFile(imgFile);
                    ImageVoiture imgEntity = new ImageVoiture();
                    imgEntity.setUrl(url);
                    imgEntity.setVoiture(savedVoiture);
                    imageVoitureRepository.save(imgEntity);
                }
            }
        }
        // Recharger la voiture avec les images
        return voitureRepository.findById(savedVoiture.getId()).map(this::convertToDto).orElse(convertToDto(savedVoiture));
    }

    public Optional<VoitureDto> updateVoiture(Long id, VoitureDto voitureDto, MultipartFile image, MultipartFile[] images) {
        return voitureRepository.findById(id).map(existingVoiture -> {
            // Mettre à jour les champs
            existingVoiture.setNom(voitureDto.getNom());
            existingVoiture.setImmatriculation(voitureDto.getImmatriculation());
            existingVoiture.setModel(voitureDto.getModel());
            existingVoiture.setAutomatique(voitureDto.getAutomatique());
            existingVoiture.setSiege(voitureDto.getSiege());
            existingVoiture.setPortiere(voitureDto.getPortiere());
            if (voitureDto.getCoffre() != null) {
                existingVoiture.setCoffre(CoffreType.valueOf(voitureDto.getCoffre()));
            }
            existingVoiture.setClimatisation(voitureDto.getClimatisation());
            existingVoiture.setPrix(voitureDto.getPrix());
            existingVoiture.setAcompte(voitureDto.getAcompte());
            existingVoiture.setPrix(voitureDto.getPrix());
            existingVoiture.setAcompte(voitureDto.getAcompte());
            if (voitureDto.getDisponibilite() != null) {
                existingVoiture.setDisponibilite(Disponibilite.valueOf(voitureDto.getDisponibilite()));
            }
            existingVoiture.setStatut(voitureDto.getStatut());
            // Gérer la relation avec la catégorie
            if (voitureDto.getCategorie() != null && voitureDto.getCategorie().getId() != null) {
                categorieRepository.findById(voitureDto.getCategorie().getId()).ifPresent(existingVoiture::setCategorie);
            }
            // Gérer l'image principale seulement si une nouvelle image est fournie
            if (image != null && !image.isEmpty()) {
                String imageName = fileStorageService.storeFile(image);
                existingVoiture.setImage(imageName);
            }
            // Gérer les images multiples (ajout)
            if (images != null && images.length > 0) {
                for (MultipartFile imgFile : images) {
                    if (imgFile != null && !imgFile.isEmpty()) {
                        String url = fileStorageService.storeFile(imgFile);
                        ImageVoiture imgEntity = new ImageVoiture();
                        imgEntity.setUrl(url);
                        imgEntity.setVoiture(existingVoiture);
                        imageVoitureRepository.save(imgEntity);
                    }
                }
            }
            return convertToDto(voitureRepository.save(existingVoiture));
        });
    }

    public void deleteVoiture(Long id) {
        voitureRepository.deleteById(id);
    }
} 