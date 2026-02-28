package com.example.Atiko.entities;

import java.util.List;
import java.util.Random;
import jakarta.persistence.*;

@Entity
@Table(name = "modeles", uniqueConstraints = {@UniqueConstraint(columnNames = {"nom", "marque_id"})})
public class Modele {
    @Id
    private Long id;

    public Modele(Long modeleId) {
        this.id = modeleId;
    }
    public Modele() {
        //TODO Auto-generated constructor stub
    }
    @PrePersist
    public void prePersist() {
        if (id == null)
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
    }

    @Column(nullable = false)
    private String nom;

    private Integer anneeSortie;
    private String typeMoteur;
    private Integer puissance;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean statut = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marque_id", nullable = false)
    private Marque marque;

    @OneToMany(mappedBy = "modele", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Voiture> voitures;

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
    public Categorie getCategorie() { return categorie; }
    public void setCategorie(Categorie categorie) { this.categorie = categorie; }
    public Marque getMarque() { return marque; }
    public void setMarque(Marque marque) { this.marque = marque; }
    public List<Voiture> getVoitures() { return voitures; }
    public void setVoitures(List<Voiture> voitures) { this.voitures = voitures; }
}
