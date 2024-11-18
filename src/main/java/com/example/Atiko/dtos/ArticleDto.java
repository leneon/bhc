package com.example.Atiko.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.Atiko.entities.Article;

public class ArticleDto {
   
    private Long id;
    private String titre;
    private String contenue;
    private Boolean statut;
    private String couverture;
    private String couverturePath;
    private Long categorieId; // Reference to the category ID 
    private CategorieDto categorie; // Reference to the category ID 
    private LocalDateTime createdAt; // Reference to the category ID 
    private Integer likes;
    private Integer dislikes;
    public Integer getDislikes() {
        return dislikes;
    }
    public void setDislikes(Integer dislikes) {
        this.dislikes = dislikes;
    }
    private Integer commentCount;  // To store the number of comments
    private List<CommentaireDto> commentaires;

    public List<CommentaireDto> getCommentaires() {
        return commentaires;
    }
    public void setCommentaires(List<CommentaireDto> commentaires) {
        this.commentaires = commentaires;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public CategorieDto getCategorie() {
        return categorie;
    }
    public void setCategorie(CategorieDto categorie) {
        this.categorie = categorie;
    }
    public ArticleDto(Article art) {
    this.id = art.getId();
    this.titre = art.getTitre();
    this.contenue = art.getContenue();
    this.statut = art.getStatut();
    this.couverture = art.getCouverture();
    this.categorie = new CategorieDto(art.getCategorie());
    this.createdAt = art.getCreatedAt();
    if(art.getCommentaires() != null)
        this.commentaires = art.getCommentaires().stream()
                .map(commentaire -> new CommentaireDto(commentaire))
                .collect(Collectors.toList());
    }
    public String getCouverturePath() {
        return couverturePath;
    }

public void setCouverturePath(String couverturePath) {
    this.couverturePath = couverturePath;
}
    public ArticleDto() {
    }
    public ArticleDto(Article article, Integer commentCount) {
        this.id = article.getId();
        this.titre = article.getTitre();
        this.contenue = article.getContenue();
        this.statut = article.getStatut();
        this.couverture = article.getCouverture();
        this.categorie = new CategorieDto(article.getCategorie());
        this.createdAt = article.getCreatedAt();
        this.commentCount = commentCount;
        this.likes = article.getLikes();
        this.dislikes = article.getDislikes();
        this.commentaires = article.getCommentaires().stream()
        // Filter comments where statut is true
        .filter(commentaire -> commentaire.getStatut() != null && commentaire.getStatut()) 
        // Map each filtered commentaire to CommentaireDto
        .map(commentaire -> new CommentaireDto(commentaire))
        .collect(Collectors.toList());
    
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitre() {
        return titre;
    }
    public void setTitre(String titre) {
        this.titre = titre;
    }
    public String getContenue() {
        return contenue;
    }
    public void setContenue(String contenue) {
        this.contenue = contenue;
    }
    public Boolean getStatut() {
        return statut;
    }
    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
    public String getCouverture() {
        return couverture;
    }
    public void setCouverture(String couverture) {
        this.couverture = couverture;
    }
    public Long getCategorieId() {
        return categorieId;
    }
    public void setCategorieId(Long categorieId) {
        this.categorieId = categorieId;
    }
    public Integer getLikes() {
        return likes;
    }
    public void setLikes(Integer likes) {
        this.likes = likes;
    }
    public Integer getCommentCount() {
        return commentCount;
    }
    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }
}
