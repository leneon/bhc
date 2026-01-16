package com.example.Atiko.dtos;

import java.time.LocalDate;

public class ClientDto {
    private Long id;
    // Le username d'un client est son email
    private String email;
    private String nomComplet;
    private String adresse;
    private String telephone;
    private String localisation;
    private String fonction;
    private String typePieceIdentite;
    private String numeroPieceIdentite;
    private String numeroPermisConduire;
    private String paysDelivrancePermis;
    private LocalDate dateDelivrancePermis;
    private LocalDate dateExpirationPermis;
    private Boolean status;
    private String createdAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // Le username est toujours l'email
    public String getUsername() { return email; }
    public void setUsername(String username) { this.email = username; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getLocalisation() { return localisation; }
    public void setLocalisation(String localisation) { this.localisation = localisation; }

    public String getFonction() { return fonction; }
    public void setFonction(String fonction) { this.fonction = fonction; }

    public String getTypePieceIdentite() { return typePieceIdentite; }
    public void setTypePieceIdentite(String typePieceIdentite) { this.typePieceIdentite = typePieceIdentite; }

    public String getNumeroPieceIdentite() { return numeroPieceIdentite; }
    public void setNumeroPieceIdentite(String numeroPieceIdentite) { this.numeroPieceIdentite = numeroPieceIdentite; }

    public String getNumeroPermisConduire() { return numeroPermisConduire; }
    public void setNumeroPermisConduire(String numeroPermisConduire) { this.numeroPermisConduire = numeroPermisConduire; }

    public String getPaysDelivrancePermis() { return paysDelivrancePermis; }
    public void setPaysDelivrancePermis(String paysDelivrancePermis) { this.paysDelivrancePermis = paysDelivrancePermis; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public LocalDate getDateDelivrancePermis() { return dateDelivrancePermis; }
    public void setDateDelivrancePermis(LocalDate dateDelivrancePermis) {
        this.dateDelivrancePermis = dateDelivrancePermis;
    }   
    public LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public void setDateExpirationPermis(LocalDate dateExpirationPermis) { 
        this.dateExpirationPermis = dateExpirationPermis;
    }    


    // Le mot de passe par défaut est "password" (à gérer côté service, non exposé ici)
}
