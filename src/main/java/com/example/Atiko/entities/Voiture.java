package com.example.Atiko.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Random;

import lombok.ToString;

@Entity
@Table( name = "voitures",  
        uniqueConstraints = { @UniqueConstraint(columnNames = "immatriculation")})
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Voiture {


  @Id
  private Long id;
  @PrePersist
    public void prePersist() {
        if (id == null) {
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
        }
    }
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String immatriculation;
    
    @Column(nullable = false)
    private Boolean automatique;
    
    @Column(nullable = false)
    private Integer siege;
    
    @Column(nullable = false)
    private Integer portiere;
    
    @Column(nullable = false)
    private String coffre;
    
    @Column(nullable = false)
    private Boolean climatisation;
    
    @Column(nullable = false)
    private String disponibilite; // "Disponible", "Réservée", "En Maintenance"
    
    @Column(nullable = false)
    private Boolean statut; // true = Actif, false = Inactif
    
    @Column
    private String image;
    
    @Column(nullable = false)
    private Double prix;
    
    @Column(nullable = true)
    private Double acompte;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "modele_id", nullable = false)
    private Modele modele;
    
    @OneToMany(mappedBy = "voiture", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImageVoiture> images;
    
    // Informations carte grise
    @Column(nullable = true)
    private String numeroCarteGrise;
    
    @Column(nullable = true)
    private String numeroSerieVin;
    
    @Column(nullable = true)
    private String datePremiereMiseEnCirculation;
    
    @Column(nullable = true)
    private String genreNational;
    
    // @Column(nullable = true)
    // private Boolean energie;
    
    @Column(nullable = true)
    private String couleur;
    
    @Column(nullable = true)
    private String poidsVide;
    
    @Column(nullable = true)
    private String poidsTotalAutorise;
    
    @Column(nullable = true)
    private Integer nombrePlaces;
    
    @Column(nullable = true)
    private String proprietaire;
    
    @Column(columnDefinition = "TEXT", nullable = true)
    private String adresseProprietaire;
    
    @Column(nullable = true)
    private String dateDelivranceCarteGrise;
    
    @Column(nullable = true)
    private String centreImmatriculation;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt = System.currentTimeMillis();
    
    @Column(name = "updated_at")
    private Long updatedAt = System.currentTimeMillis();


}