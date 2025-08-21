package com.example.Atiko.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Random;

@Entity
@Table(name = "voitures")
@Data
@NoArgsConstructor
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
    @Column(nullable = false, unique = true)
    private String immatriculation;
    @Column(nullable = false)
    private String model;
    @Column(nullable = false)
    private Boolean automatique;
    @Column(nullable = false)
    private Integer siege;
    @Column(nullable = false)
    private Integer portiere;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoffreType coffre;
    @Column(nullable = false)
    private Boolean climatisation;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Disponibilite disponibilite;
    @Column(nullable = false)
    private Boolean statut;
    @Column(nullable = true)
    private String image;
    @Column
    private Double prix;
    
    @Column
    private Double acompte;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @OneToMany(mappedBy = "voiture", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ImageVoiture> images;

    
} 