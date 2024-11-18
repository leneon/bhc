package com.example.Atiko.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Atiko.dtos.CommentaireDto;
import com.example.Atiko.entities.Article;
import com.example.Atiko.entities.Commentaire;
import com.example.Atiko.repositories.ArticleRepository;
import com.example.Atiko.repositories.CommentaireRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentaireService {

    @Autowired
    private CommentaireRepository commentaireRepository;

    @Autowired
    private ArticleRepository articleRepository;  // Assuming you have an ArticleRepository for fetching articles

    // Save or update a comment
    public CommentaireDto saveCommentaire(CommentaireDto commentaireDto) {
        Commentaire commentaire = new Commentaire();
        commentaire.setContenue(commentaireDto.getContenue());
        commentaire.setUseremail(commentaireDto.getUseremail());
        commentaire.setUsername(commentaireDto.getUsername());
        commentaire.setStatut(true);
        
        // Set the associated article
        Article article = articleRepository.findById(commentaireDto.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article not found"));
        commentaire.setArticle(article);

        Commentaire savedCommentaire = commentaireRepository.save(commentaire);
        return new CommentaireDto(savedCommentaire);
    }

    // Get all comments for a specific article
    public List<CommentaireDto> getCommentairesByArticleId(Long articleId) {
        List<Commentaire> commentaires = commentaireRepository.findByArticleId(articleId);
        return commentaires.stream()
                .map(commentaire -> new CommentaireDto(commentaire))
                .collect(Collectors.toList());
    }

    // Get a single comment by ID
    public CommentaireDto getCommentaireById(Long id) {
        Commentaire commentaire = commentaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return new CommentaireDto(commentaire);
    }

    // Delete a comment
    public void deleteCommentaire(Long id) {
        commentaireRepository.deleteById(id);
    }
}
