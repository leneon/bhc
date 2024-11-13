package com.example.Atiko.dtos;

import java.time.LocalDateTime;

import com.example.Atiko.entities.Commentaire;

public class CommentaireDto {
    
    private Long id;
    private String username;
    private String useremail;
    private String contenue;
    private Boolean statut;
    private Long articleId;  // To store the ID of the related article
    private LocalDateTime createdAt; // Reference to the category ID 

    // Constructors
    public CommentaireDto() {}

    public CommentaireDto(Long id,String username,String useremail, String contenue, Boolean statut, Long articleId) {
        this.id = id;
        this.username = username;
        this.useremail = useremail;
        this.contenue = contenue;
        this.statut = statut;
        this.articleId = articleId;
    }

    public CommentaireDto(Commentaire commentaire) {
        this.useremail = commentaire.getUseremail();
        this.username = commentaire.getUsername();
        this.id = commentaire.getId();
        this.contenue = commentaire.getContenue();
        this.statut = commentaire.getStatut();
        this.createdAt = commentaire.getCreatedAt();
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUseremail() {
        return useremail;
    }

    public void setUseremail(String useremail) {
        this.useremail = useremail;
    }
}
