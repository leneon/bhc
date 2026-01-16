package com.example.Atiko.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "assurances")
@Getter
@Setter
@NoArgsConstructor
public class Assurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String compagnie;

    @Column(nullable = false, unique = true)
    private String numeroPolice;

    @Column(nullable = false)
    private String type; // "Tierce", "Tous risques", "Responsabilité civile", etc.

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = true)
    private String document; // chemin du fichier ou URL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voiture_id", nullable = false)
    private Voiture voiture;

    @Transient
    private String statut;

    /**
     * Calcul automatique du statut
     * ACTIVE, EXPIRATION_PROCHE (-3 mois avant fin), EXPIREE
     */
    @PostLoad
    @PostPersist
    @PostUpdate
    public void calculateStatut() {
        LocalDate now = LocalDate.now();

        if (dateFin.isBefore(now)) {
            statut = "EXPIREE";
        } else if (!dateFin.minusMonths(3).isAfter(now)) { // moins de 3 mois
        statut = "ALERTE"; // ou "EXPIRATION_PROCHE" selon ton besoin
        } else {
            statut = "ACTIVE";
        }
    }
}
