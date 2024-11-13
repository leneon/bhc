package com.example.Atiko.dtos;

import java.util.List;

import com.example.Atiko.entities.Espace;

public class EspaceDto {
    private Long id;
    private String nom;
    private String type;
    private String description;
    private Double tarif;
    private Boolean statut;
    private String img;
    private List<UploadDto> paths;  // Liste des DTO `Upload` associés

    
    public EspaceDto() {
    }
    public EspaceDto(Espace espace) {
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
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Double getTarif() {
        return tarif;
    }
    public void setTarif(Double tarif) {
        this.tarif = tarif;
    }
    public Boolean getStatut() {
        return statut;
    }
    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
    public String getImg() {
        return img;
    }
    public void setImg(String img) {
        this.img = img;
    }
    public List<UploadDto> getPaths() {
        return paths;
    }
    public void setPaths(List<UploadDto> paths) {
        this.paths = paths;
    }

    // Getters et Setters
}

