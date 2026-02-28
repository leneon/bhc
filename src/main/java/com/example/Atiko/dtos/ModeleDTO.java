package com.example.Atiko.dtos;

import com.example.Atiko.entities.Modele;

public class ModeleDTO {
    private Long id;
    private String nom;
    private Integer anneeSortie;
    private String typeMoteur;
    private Integer puissance;
    private String description;
    private Boolean statut;
    private Long categorieId;
    private Long marqueId;

    // Champs supplémentaires pour l'affichage
    private String categorieName;
    private String marqueName;
    
    public ModeleDTO() {
    }   
    public ModeleDTO(Modele modele) {
        this.id = modele.getId();
        this.nom = modele.getNom();
        this.anneeSortie = modele.getAnneeSortie();
        this.typeMoteur = modele.getTypeMoteur();
        this.puissance = modele.getPuissance();
        this.description = modele.getDescription();
        this.statut = modele.getStatut();
        if (modele.getCategorie() != null) {
            this.categorieId = modele.getCategorie().getId();
            this.categorieName = modele.getCategorie().getNom();
        }
        if (modele.getMarque() != null) {
            this.marqueId = modele.getMarque().getId();
            this.marqueName = modele.getMarque().getNom();
        }
    }
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Integer getAnneeSortie() { return anneeSortie; }
    public void setAnneeSortie(Integer anneeSortie) { this.anneeSortie = anneeSortie; }
    public String getTypeMoteur() { return typeMoteur; }
    public void setTypeMoteur(String typeMoteur) { this.typeMoteur = typeMoteur; }
    public Integer getPuissance() { return puissance; }
    public void setPuissance(Integer puissance) { this.puissance = puissance; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getStatut() { return statut; }
    public void setStatut(Boolean statut) { this.statut = statut; }
    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }
    public Long getMarqueId() { return marqueId; }
    public void setMarqueId(Long marqueId) { this.marqueId = marqueId; }

    public String getCategorieName() { return categorieName; }
    public void setCategorieName(String categorieName) { this.categorieName = categorieName;}
    public String getMarqueName() { return marqueName; }
    public void setMarqueName(String marqueName) { this.marqueName = marqueName; }

}
