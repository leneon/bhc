package com.example.Atiko.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.ArticleDto;
import com.example.Atiko.entities.Article;
import com.example.Atiko.entities.Categorie;
import com.example.Atiko.repositories.ArticleRepository;
import com.example.Atiko.repositories.CategorieRepository;
import com.example.Atiko.repositories.CommentaireRepository;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final CategorieRepository categorieRepository;
    private final FileStorageService fileStorageService;
    private final CommentaireRepository commentaireRepository;

    @Autowired
    public ArticleService(CommentaireRepository commentaireRepository,ArticleRepository articleRepository, CategorieRepository categorieRepository, FileStorageService fileStorageService) {
        this.articleRepository = articleRepository;
        this.categorieRepository = categorieRepository;
        this.fileStorageService = fileStorageService;
        this.commentaireRepository = commentaireRepository;
    }


    // Upload image and save article
    public ArticleDto createArticle(ArticleDto articleDto, MultipartFile imageFile) throws IOException{
        Article article = new Article();
        article.setTitre(articleDto.getTitre());
        article.setContenue(articleDto.getContenue());
        article.setStatut(true);

        // Save image file if present
        if (imageFile != null && !imageFile.isEmpty()) {
            String filePath = fileStorageService.storeFile(imageFile);
            article.setCouverture(filePath); // Set image file path to `couverture`
        }
        // Set Categorie
        Categorie categorie = categorieRepository.findById(articleDto.getCategorieId())
                .orElseThrow(() -> new RuntimeException("Categorie not found with ID " + articleDto.getCategorieId()));
        article.setCategorie(categorie);

        articleRepository.save(article);
        return new ArticleDto(article);
    }

    public List<ArticleDto> getAllArticlesWithCommentCount() {
        // Fetch all articles with statut = true
        List<Article> articles = articleRepository.findAll();
    
        // Map articles with statut = true to ArticleDto, including the number of comments, and sort by createdAt
        return articles.stream()
            .filter(article -> Boolean.TRUE.equals(article.getStatut())) // Filtre les articles avec statut à true
            .sorted(Comparator.comparing(Article::getCreatedAt).reversed()) // Trie par createdAt dans l'ordre décroissant
            .map(article -> {
                // Get the number of comments for the current article
                Integer commentCount = commentaireRepository.countByArticleId(article.getId());
    
                // Create and return an ArticleDto containing the article and comment count
                return new ArticleDto(article, commentCount);
            })
            .collect(Collectors.toList());
    }
    
     
    // Get all articles with the number of comments
    public List<ArticleDto> getAllArticles() {
        List<Article> articles = articleRepository.findAll();
        return articles.stream()
                .map(article -> {
                    // Get the number of comments for the article
                    Integer commentCount = commentaireRepository.countByArticleId(article.getId());
                    return new ArticleDto(article, commentCount);
                })
                .collect(Collectors.toList());
    }

    // Get article by ID with the number of comments
    public ArticleDto getArticleById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        
        Integer commentCount = commentaireRepository.countByArticleId(article.getId());
        return new ArticleDto(article, commentCount);
    }

    // Update an existing Article
    public ArticleDto updateArticle(Long id, ArticleDto articleDto, MultipartFile imageFile) throws IOException {

        Optional<Article> optionalArticle = articleRepository.findById(id);
        if (optionalArticle.isPresent()) {
            Article article = optionalArticle.get();
            article.setTitre(articleDto.getTitre());
            article.setContenue(articleDto.getContenue());
            //article.setStatut(articleDto.getStatut());
            // Save image file if present
            if (imageFile != null && !imageFile.isEmpty() && imageFile instanceof MultipartFile ) {
                article.setCouverture(fileStorageService.storeFile(imageFile)); // Set image file path to `couverture`
            }
            // Update Categorie
            Categorie categorie = categorieRepository.findById(articleDto.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Categorie not found with ID " + articleDto.getCategorieId()));
            article.setCategorie(categorie);

            articleRepository.save(article);
            return new ArticleDto(article);
        } else {
            throw new RuntimeException("Article not found with ID " + id);
        }
    }

    // Update an existing Article
    public ArticleDto disable(Long id) {

        Optional<Article> optionalArticle = articleRepository.findById(id);
        if (optionalArticle.isPresent()) {
            Article article = optionalArticle.get();
            article.setStatut(!article.getStatut());
            articleRepository.save(article);
            return new ArticleDto(article);
        } else {
            throw new RuntimeException("Article not found with ID " + id);
        }
    }

    // Update an existing Article
    public ArticleDto like(Long id) {

            Optional<Article> optionalArticle = articleRepository.findById(id);
            if (optionalArticle.isPresent()) {
                Article article = optionalArticle.get();
                article.setLikes(article.getLikes()!=null?(article.getLikes()+1):1);
                articleRepository.save(article);
                return new ArticleDto(article);
            } else {
                throw new RuntimeException("Article not found with ID " + id);
            }
     }

    public ArticleDto dislike(Long id) {
            Optional<Article> optionalArticle = articleRepository.findById(id);
            if (optionalArticle.isPresent()) {
                Article article = optionalArticle.get();
                article.setDislikes(article.getDislikes()!=null?(article.getDislikes()+1):1);
                articleRepository.save(article);
                return new ArticleDto(article);
            } else {
                throw new RuntimeException("Article not found with ID " + id);
            }
        }
    
    // Delete an Article by ID
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article not found with ID " + id);
        }
        articleRepository.deleteById(id);
    }
}
