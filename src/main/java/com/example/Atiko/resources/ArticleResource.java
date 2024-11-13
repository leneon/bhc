package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.ArticleDto;
import com.example.Atiko.services.ArticleService;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleResource {

    @Autowired
    private ArticleService articleService;

    // Create an article
    @PostMapping(consumes ={ MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ArticleDto> createArticle(@RequestPart("articleDto") ArticleDto articleDto, 
                                                    @RequestPart(value ="couverture", required=true) MultipartFile couverture) throws IOException {
        if (couverture == null) {
            throw new IllegalArgumentException("Le fichier couverture est requis.");
        }
        ArticleDto createdArticle = articleService.createArticle(articleDto, couverture);
        return ResponseEntity.ok(createdArticle);
    }

    // Update an article
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ArticleDto> updateArticle(@PathVariable Long id, 
                                                    @RequestPart("articleDto") ArticleDto articleDto, 
                                                    @RequestPart(value = "couverture", required = false) MultipartFile couverture) throws IOException {
        ArticleDto updatedArticle = articleService.updateArticle(id, articleDto, couverture);
        return ResponseEntity.ok(updatedArticle);
    }

        // Update an article
    @PutMapping(value = "/disable/{id}")
    public ResponseEntity<ArticleDto> disable(@PathVariable Long id)  {
        ArticleDto updatedArticle = articleService.disable(id);
        return ResponseEntity.ok(updatedArticle);
    }

    // Get all articles
    @GetMapping
    public ResponseEntity<List<ArticleDto>> getAllArticles() {
        List<ArticleDto> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }

    // Get an article by ID
    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto> getArticleById(@PathVariable Long id) {
        ArticleDto article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    // Delete an article
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}

