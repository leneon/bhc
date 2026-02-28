package com.example.Atiko.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(nullable = false, length = 200)
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;
    
    @Column(name = "type_reduction", nullable = false, length = 20)
    private String typeReduction; // "FIXE" ou "POURCENTAGE"
    
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;
    
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
    
    @Column(name = "nombre_utilisations_max")
    private Integer nombreUtilisationsMax;
    
    @Column(name = "nombre_utilisations_actuelles")
    private Integer nombreUtilisationsActuelles = 0;
    
    @Column(nullable = false)
    private Boolean actif = true;
    
    @Column(name = "montant_minimum")
    private BigDecimal montantMinimum;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
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

