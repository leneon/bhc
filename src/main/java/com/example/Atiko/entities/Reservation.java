package com.example.Atiko.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "vehicule_id", nullable = false)
    private Voiture vehicule;

    @Column(name = "date_reservation", nullable = false)
    private LocalDateTime dateReservation;

    @Column(name = "date_debut_prevue", nullable = false)
    private LocalDateTime dateDebutPrevue;

    @Column(name = "date_fin_prevue", nullable = false)
    private LocalDateTime dateFinPrevue;

    @Column(name = "lieu_depart", length = 100)
    private String lieuDepart;

    @Column(name = "lieu_retour", length = 100)
    private String lieuRetour;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat_reservation", length = 20)
    private EtatReservation etatReservation;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_paiement", length = 20)
    private ModePaiement modePaiement;

    @Column(name = "montant_total", precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Column(name = "acompte", precision = 10, scale = 2)
    private BigDecimal acompte;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "remise", precision = 5, scale = 2)
    private BigDecimal remise;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;
    
    @Column(name = "nombre_jours")
    private Integer nombreJours;

    // Getters et setters
    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }
    public Voiture getVehicule() { return vehicule; }
    public void setVehicule(Voiture vehicule) { this.vehicule = vehicule; }
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
    public EtatReservation getEtatReservation() { return etatReservation; }
    public void setEtatReservation(EtatReservation etatReservation) { this.etatReservation = etatReservation; }
    public ModePaiement getModePaiement() { return modePaiement; }
    public void setModePaiement(ModePaiement modePaiement) { this.modePaiement = modePaiement; }
    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }
    public BigDecimal getAcompte() { return acompte; }
    public void setAcompte(BigDecimal acompte) { this.acompte = acompte; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public BigDecimal getRemise() { return remise; }
    public void setRemise(BigDecimal remise) { this.remise = remise; }
    
    public Coupon getCoupon() { return coupon; }
    public void setCoupon(Coupon coupon) { this.coupon = coupon; }
    
    public Integer getNombreJours() { return nombreJours; }
    public void setNombreJours(Integer nombreJours) { this.nombreJours = nombreJours; }

    // Enumérations internes
    public enum EtatReservation { en_attente, confirmee, annulee, expiree }
    public enum ModePaiement { carte, cash, virement, mobile_money }
}
