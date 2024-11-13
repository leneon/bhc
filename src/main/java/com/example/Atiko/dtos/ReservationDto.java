package com.example.Atiko.dtos;

import java.util.Date;

public class ReservationDto {
    private Long id;
    private Long userId;     // Pour stocker l'ID de l'utilisateur
    private Long espaceId;   // Pour stocker l'ID de l'espace
    private Date dateDebut;
    private Date dateFin;
    private Boolean statut;

    
    public ReservationDto() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getEspaceId() {
        return espaceId;
    }
    public void setEspaceId(Long espaceId) {
        this.espaceId = espaceId;
    }
    public Date getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }
    public Date getDateFin() {
        return dateFin;
    }
    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }
    public Boolean getStatut() {
        return statut;
    }
    public void setStatut(Boolean statut) {
        this.statut = statut;
    }

    // Getters et setters
}
