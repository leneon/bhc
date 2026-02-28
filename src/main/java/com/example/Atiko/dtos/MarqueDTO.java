package com.example.Atiko.dtos;

public class MarqueDTO {
    private Long id;
    private String nom;
    private String description;
    private Boolean statut;

    public MarqueDTO() {
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getStatut() { return statut; }
    public void setStatut(Boolean statut) { this.statut = statut; }
}
