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
}
