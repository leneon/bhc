package com.example.Atiko.entities;

import java.util.Random;
import jakarta.persistence.*;

@Entity
@Table(name = "marques", uniqueConstraints = {@UniqueConstraint(columnNames = "nom")})
public class Marque {
    @Id
    private Long id;

    public Marque(Long marqueId) {
        this.id = marqueId;
    }
    @PrePersist
    public void prePersist() {
        if (id == null)
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
    }

    @Column(nullable = false)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean statut = true;

    @OneToMany(mappedBy = "marque", cascade = CascadeType.ALL, fetch = FetchType.LAZY)

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getStatut() { return statut; }
    public void setStatut(Boolean statut) { this.statut = statut; }


    public Marque() {
    }   
}
