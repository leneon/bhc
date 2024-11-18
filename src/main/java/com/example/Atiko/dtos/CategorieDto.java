package com.example.Atiko.dtos;

import com.example.Atiko.entities.Categorie;

public class CategorieDto {
    private Long id;
    private String nom;
    private Boolean statut;
    private Integer articlesCount;

    public Integer getArticlesCount() {
        return articlesCount;
    }

    public void setArticlesCount(Integer articlesCount) {
        this.articlesCount = articlesCount;
    }

    // Constructors
    public CategorieDto() {this.statut=true;}

    public CategorieDto(Long id, String nom, Boolean statut) {
        this.id = id;
        this.nom = nom;
        this.statut = statut;
    }
    public CategorieDto(Categorie cat) {
        this.id = cat.getId();
        this.nom = cat.getNom();
        this.statut = cat.getStatut();
        if(cat.getArticles() != null )
            this.articlesCount = cat.getArticles().size();
    }

    // Getters and Setters
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

    public Boolean getStatut() {
        return statut;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
}
