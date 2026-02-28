package com.example.Atiko.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReservationDto {
    private Long reservationId;
    private Long clientId;
    private Long vehiculeId;
    private LocalDateTime dateReservation;
    private LocalDateTime dateDebutPrevue;
    private LocalDateTime dateFinPrevue;
    private String lieuDepart;
    private String lieuRetour;
    private String etatReservation;
    private String modePaiement;
    private BigDecimal montantTotal;
    private BigDecimal acompte;
    private String notes;
    private BigDecimal remise;
    private Long couponId;
    private String couponCode;
    private BigDecimal couponMontant;
    private String couponTypeReduction;
    private Integer nombreJours;
    
    // Champs supplémentaires pour l'affichage
    private String clientNom;
    private String clientEmail;
    private String voitureNom;
    private String voitureImmatriculation;

    // Getters et setters
    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public Long getVehiculeId() { return vehiculeId; }
    public void setVehiculeId(Long vehiculeId) { this.vehiculeId = vehiculeId; }
    public LocalDateTime getDateReservation() { return dateReservation; }
    public void setDateReservation(LocalDateTime dateReservation) { this.dateReservation = dateReservation; }
    public LocalDateTime getDateDebutPrevue() { return dateDebutPrevue; }
    public void setDateDebutPrevue(LocalDateTime dateDebutPrevue) { this.dateDebutPrevue = dateDebutPrevue; }
    public LocalDateTime getDateFinPrevue() { return dateFinPrevue; }
    public void setDateFinPrevue(LocalDateTime dateFinPrevue) { this.dateFinPrevue = dateFinPrevue; }
    public String getLieuDepart() { return lieuDepart; }
    public void setLieuDepart(String lieuDepart) { this.lieuDepart = lieuDepart; }
    public String getLieuRetour() { return lieuRetour; }
    public void setLieuRetour(String lieuRetour) { this.lieuRetour = lieuRetour; }
    public String getEtatReservation() { return etatReservation; }
    public void setEtatReservation(String etatReservation) { this.etatReservation = etatReservation; }
    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }
    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }
    public BigDecimal getAcompte() { return acompte; }
    public void setAcompte(BigDecimal acompte) { this.acompte = acompte; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    // Getters et setters pour les champs supplémentaires
    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }
    
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    
    public String getVoitureNom() { return voitureNom; }
    public void setVoitureNom(String voitureNom) { this.voitureNom = voitureNom; }
    
    public String getVoitureImmatriculation() { return voitureImmatriculation; }
    public void setVoitureImmatriculation(String voitureImmatriculation) { this.voitureImmatriculation = voitureImmatriculation; }
    
    public BigDecimal getRemise() { return remise; }
    public void setRemise(BigDecimal remise) { this.remise = remise; }
    
    public Long getCouponId() { return couponId; }
    public void setCouponId(Long couponId) { this.couponId = couponId; }
    
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
    
    public BigDecimal getCouponMontant() { return couponMontant; }
    public void setCouponMontant(BigDecimal couponMontant) { this.couponMontant = couponMontant; }
    
    public String getCouponTypeReduction() { return couponTypeReduction; }
    public void setCouponTypeReduction(String couponTypeReduction) { this.couponTypeReduction = couponTypeReduction; }
    
    public Integer getNombreJours() { return nombreJours; }
    public void setNombreJours(Integer nombreJours) { this.nombreJours = nombreJours; }
}
