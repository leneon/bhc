package com.example.Atiko.entities;

import java.util.List;
import java.util.Random;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.*;

@Entity
@Table(name = "categories", uniqueConstraints = {
        @UniqueConstraint(columnNames = "nom")
})
public class Categorie {
    @Id
    private Long id;
    @PrePersist
    public void prePersist() {
        if (id == null) {
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
        }
    }
    @Column
    private String nom;
    
    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;
    
    @OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Article> articles;
    public List<Article> getArticles() {
        return articles;
    }

    public void setArticles(List<Article> articles) {
        this.articles = articles;
    }

    @Column(nullable = false)
    @ColumnDefault("true") // Valeur par défaut de true
    private Boolean statut;


    public Boolean getStatut() {
        return statut;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }

    public Categorie() {
        this.statut = true;
    }

    public Categorie(Long categorieId) {
        this.id = categorieId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    

}
