package com.example.Atiko.dtos;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AssuranceDto {

    private Long id;
    private String compagnie;
    private String numeroPolice;
    private String type; // ou Enum
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;
    private String document; // fichier uploadé
    private Long voitureId;

    // Champ calculé côté serveur
    private String statut;
}

