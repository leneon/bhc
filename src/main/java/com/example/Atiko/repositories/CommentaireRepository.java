package com.example.Atiko.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.Commentaire;

public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    
    // Custom query methods if needed
    List<Commentaire> findByArticleId(Long articleId);
    // Custom query to count the number of comments for a specific article
    Integer countByArticleId(Long articleId);
}

