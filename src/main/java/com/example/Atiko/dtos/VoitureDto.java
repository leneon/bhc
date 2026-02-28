package com.example.Atiko.dtos;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class VoitureDto{

    private Long id;
    
    private String nom;
    
    private String immatriculation;
    
    private Boolean automatique; //default true
    
    private Integer siege;
    
    private Integer portiere;
    
    private String coffre;
    
    private Boolean climatisation; //default true
    
    private String disponibilite; //default "disponible"
    
    private Boolean statut; //default true
    
    private String image;
    
    private Double prix;
    
    private Double acompte;
    
    private Long modeleId;
    
    private String modeleName;

    private ModeleDTO modele;
    
    private List<ImageVoitureDto> images; //optionnel
    
    // Informations carte grise champs optionnelles
    private String numeroCarteGrise;
    
    // private String energie;
    
    private String numeroSerieVin;
    
    private String datePremiereMiseEnCirculation;
    
    private String genreNational;
        
    private String couleur;
    
    private String poidsVide;
    
    private String poidsTotalAutorise;
    
    private Integer nombrePlaces;
    
    private String proprietaire;
    
    private String adresseProprietaire;
    
    private String dateDelivranceCarteGrise;
    
    private String centreImmatriculation;
}