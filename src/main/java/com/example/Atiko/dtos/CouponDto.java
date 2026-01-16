package com.example.Atiko.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CouponDto {
    private Long id;
    private String code;
    private String description;
    private BigDecimal montant;
    private String typeReduction; // "FIXE" ou "POURCENTAGE"
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer nombreUtilisationsMax;
    private Integer nombreUtilisationsActuelles;
    private Boolean actif;
    private BigDecimal montantMinimum;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    
    public String getTypeReduction() { return typeReduction; }
    public void setTypeReduction(String typeReduction) { this.typeReduction = typeReduction; }
    
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    
    public Integer getNombreUtilisationsMax() { return nombreUtilisationsMax; }
    public void setNombreUtilisationsMax(Integer nombreUtilisationsMax) { this.nombreUtilisationsMax = nombreUtilisationsMax; }
    
    public Integer getNombreUtilisationsActuelles() { return nombreUtilisationsActuelles; }
    public void setNombreUtilisationsActuelles(Integer nombreUtilisationsActuelles) { this.nombreUtilisationsActuelles = nombreUtilisationsActuelles; }
    
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
    
    public BigDecimal getMontantMinimum() { return montantMinimum; }
    public void setMontantMinimum(BigDecimal montantMinimum) { this.montantMinimum = montantMinimum; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}



