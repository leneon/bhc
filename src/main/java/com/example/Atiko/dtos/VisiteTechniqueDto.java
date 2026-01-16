package com.example.Atiko.dtos;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class VisiteTechniqueDto {
    private Long id;
    private String centre;
    private String numero;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String document;
    private Long voitureId;
    private String statut;


}
