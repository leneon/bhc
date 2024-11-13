package com.example.Atiko.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = true) // 'nullable = false' car l'utilisateur est requis
    private User user;
    @ManyToOne
    @JoinColumn(name = "espace_id", referencedColumnName = "id", nullable = false) // 'nullable = false' car l'utilisateur est requis
    private Espace espace;
    @Column(name = "date_debut")
    private Date dateDebut;
    @Column(name = "dateFin")
    private Date detaFin;
    @Column
    private Boolean statut;
    
    public Reservation() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Espace getEspace() {
        return espace;
    }
    public void setEspace(Espace espace) {
        this.espace = espace;
    }
    public Date getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }
    public Date getDetaFin() {
        return detaFin;
    }
    public void setDetaFin(Date detaFin) {
        this.detaFin = detaFin;
    }
    public Boolean getStatut() {
        return statut;
    }
    public void setStatut(Boolean statut) {
        this.statut = statut;
    }

    
}
