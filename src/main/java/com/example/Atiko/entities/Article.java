package com.example.Atiko.entities;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String titre;
    @Column(columnDefinition = "TEXT", nullable = true)  // Utilise le type TEXT
    private String contenue;
    @Column
    private Boolean statut;
    @Column
    private String couverture;
    @Column
    private Integer likes;
    @Column
    private Integer dislikes;
    
    // Define the One-to-Many relationship with Commentaire
    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Commentaire> commentaires;


    public String getCouverture() {
        return couverture;
    }
    public void setCouverture(String couverture) {
        this.couverture = couverture;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;
  
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Integer getDislikes() {
        return dislikes;
    }
    public void setDislikes(Integer dislikes) {
        this.dislikes = dislikes;
    }
    public void dislikes() {
        this.dislikes = this.dislikes++;
    }
    public void likes() {
        this.likes = this.likes++;
    }


    public Article() {
        this.statut = true;
    }
    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    // Getters and Setters for createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
    public Integer getLikes() {
        return likes;
    }
    public void setLikes(Integer likes) {
        this.likes = likes;
    }
    public List<Commentaire> getCommentaires() {
        return commentaires;
    }
    public void setCommentaires(List<Commentaire> commentaires) {
        this.commentaires = commentaires;
    }

}
