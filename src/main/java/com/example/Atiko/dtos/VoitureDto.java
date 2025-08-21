package com.example.Atiko.dtos;

import lombok.Data;
import java.util.List;

@Data
public class VoitureDto {
    private Long id;
    private String nom;
    private String immatriculation;
    private String model;
    private Boolean automatique;
    private Integer siege;
    private Integer portiere;
    private String coffre;
    private Boolean climatisation;
    private String disponibilite;
    private Boolean statut;
    private String image;
    private CategorieDto categorie;
    private String categorieId;
    private List<ImageVoitureDto> images;

    private Double prix;
    private Double acompte;
}