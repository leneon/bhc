package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.dtos.CommentaireDto;
import com.example.Atiko.services.CommentaireService;

import java.util.List;

@RestController
@RequestMapping("/api/commentaires")
public class CommentaireResource {

    @Autowired
    private CommentaireService commentaireService;

    // Create or update a comment
    @PostMapping
    public ResponseEntity<CommentaireDto> createOrUpdateCommentaire(@RequestBody CommentaireDto commentaireDto) {
        CommentaireDto savedCommentaire = commentaireService.saveCommentaire(commentaireDto);
        return ResponseEntity.ok(savedCommentaire);
    }

    // Get all comments for a specific article
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentaireDto>> getCommentairesByArticleId(@PathVariable Long articleId) {
        List<CommentaireDto> commentaires = commentaireService.getCommentairesByArticleId(articleId);
        return ResponseEntity.ok(commentaires);
    }

    // Get a single comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<CommentaireDto> getCommentaireById(@PathVariable Long id) {
        CommentaireDto commentaire = commentaireService.getCommentaireById(id);
        return ResponseEntity.ok(commentaire);
    }

    // Delete a comment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.deleteCommentaire(id);
        return ResponseEntity.noContent().build();
    }
}
