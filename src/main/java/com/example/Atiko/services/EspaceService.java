package com.example.Atiko.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.ArticleDto;
import com.example.Atiko.dtos.EspaceDto;
import com.example.Atiko.entities.Article;
import com.example.Atiko.entities.Espace;
import com.example.Atiko.repositories.EspaceRepository;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class EspaceService {
    
    @Autowired
    private EspaceRepository espaceRepository;
    @Autowired
    private  FileStorageService fileStorageService;

    public List<Espace> findAll() {
        return espaceRepository.findAll();
    }

    public Optional<Espace> findById(Long id) {
        return espaceRepository.findById(id);
    }

    public Espace save(Espace espace, MultipartFile couverture, MultipartFile[] images) {
         // Save image file if present
         if (couverture != null && !couverture.isEmpty()) {
            String filePath = fileStorageService.storeFile(couverture);
            espace.setImg(filePath); // Set image file path to `couverture`
        }
        Espace espaceCreated = espaceRepository.save(espace);
        if (espaceCreated != null && images != null && images.length > 0) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    fileStorageService.storeFile(couverture) ;
                }
            }
        }
        return espaceRepository.save(espace);
    }

    public Espace update(Long id, Espace espace, MultipartFile couverture, MultipartFile[] images) {
        // Récupérer l'espace existant
        Optional<Espace> existingEspaceOpt = espaceRepository.findById(id);

        Espace existingEspace = existingEspaceOpt.get();

        // Mettre à jour les champs de l'espace existant
        existingEspace.setNom(espace.getNom());
        existingEspace.setDescription(espace.getDescription());
        existingEspace.setTarif(espace.getTarif());
        // Mettez à jour d'autres champs nécessaires ici

        // Gérer le fichier de couverture si présent
        if (couverture != null && !couverture.isEmpty()) {
            String couverturePath = fileStorageService.storeFile(couverture);
            existingEspace.setImg(couverturePath);
        }

        // Gérer les images supplémentaires si présentes
        if (images != null && images.length > 0) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imagePath = fileStorageService.storeFile(image);
                    // Ajouter cette image à la liste d'images de `Espace` si elle existe
                }
            }
        }

        // Enregistrer l'espace mis à jour
        return espaceRepository.save(existingEspace);
    }


    public void deleteById(Long id) {
        espaceRepository.deleteById(id);
    }

    // Update an existing Article
    public EspaceDto disable(Long id) {

        Optional<Espace> optionalespace = espaceRepository.findById(id);
        if (optionalespace.isPresent()) {
            Espace espace = optionalespace.get();
            espace.setStatut(!espace.getStatut());
            espaceRepository.save(espace);
            return new EspaceDto(espace);
        } else {
            throw new RuntimeException("Article not found with ID " + id);
        }
    }

}
