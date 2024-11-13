package com.example.Atiko.services;

import com.example.Atiko.dtos.CategorieDto;
import com.example.Atiko.dtos.NewsletterDto;
import com.example.Atiko.entities.Categorie;
import com.example.Atiko.entities.Newsletter;
import com.example.Atiko.repositories.CategorieRepository;
import com.example.Atiko.repositories.NewsletterRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    // Convert Categorie to CategorieDto
    private NewsletterDto convertToDto(Newsletter news) {
        return new NewsletterDto(news);
    }

    // Convert CategorieDto to Categorie
    private Newsletter convertToEntity(NewsletterDto dto) {
        Newsletter news = new Newsletter();
        news.setId(dto.getId());
        news.setUseremail(dto.getUseremail());
        return news;
    }

    public List<NewsletterDto> getNewslettes() {
        return newsletterRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }



    public NewsletterDto createNewsletter(NewsletterDto dto) {
        // Vérifier si l'email existe déjà
        Optional<Newsletter> existingNewsletter = newsletterRepository.findByUseremail(dto.getUseremail());
        if (existingNewsletter.isPresent()) {
            throw new IllegalArgumentException("Cet email est déjà inscrit à la newsletter.");
        }
        
        // Convertir le DTO en entité
        Newsletter news = convertToEntity(dto);
        // Sauvegarder la nouvelle entité
        Newsletter savedNews = newsletterRepository.save(news);
        // Convertir l'entité sauvegardée en DTO
        return convertToDto(savedNews);
    }
    

    public void deleteNewsletter(Long id) {
        newsletterRepository.deleteById(id);
    }
}
