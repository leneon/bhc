package com.example.Atiko.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "visites_techniques")
@Getter
@Setter
@NoArgsConstructor
public class VisiteTechnique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String centre;
    private String numero;
    private LocalDate dateDebut;
    private LocalDate dateFin;

    private String document; // Fichier PDF ou image

    @ManyToOne
    @JoinColumn(name="voiture_id")
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

