package com.example.Atiko.dtos;


import java.time.LocalDateTime;

import com.example.Atiko.entities.User;
import com.example.Atiko.security.services.UserDetailsImpl;

public class UserDto {
    private Long id;
    
    private String email;

    private String username;
    
    private String role;

    private LocalDateTime createdAt;

    private Boolean status;

    private String password;
    
    private String avatar;

    // Champs du profil pour la liste client et création complète
    private String nom;
    private String adresse;
    private String telephone;
    private String localisation;
    private String fonction;
    private String typePieceIdentite;
    private String numeroPieceIdentite;
    private String numeroPermisConduire;
    private String paysDelivrancePermis;
    private java.time.LocalDate dateDelivrancePermis;
    private java.time.LocalDate dateExpirationPermis;

    
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

    public java.time.LocalDate getDateDelivrancePermis() { return dateDelivrancePermis; }
    public void setDateDelivrancePermis(java.time.LocalDate dateDelivrancePermis) { this.dateDelivrancePermis = dateDelivrancePermis; }

    public java.time.LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public void setDateExpirationPermis(java.time.LocalDate dateExpirationPermis) { this.dateExpirationPermis = dateExpirationPermis; }

    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Boolean getStatus() {
        return status;
    }
    public void setStatus(Boolean status) {
        this.status = status;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public UserDto() {
    }
    public UserDto(UserDetailsImpl user,String role) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = role;
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getFirstRoleAsString();
        this.createdAt = user.getCreatedAt();
        this.status = user.getStatus();
        // Récupérer l'avatar du profil si il existe
        if (user.getProfile() != null && user.getProfile().getAvatar() != null) {
            this.avatar = user.getProfile().getAvatar();
        }

        // Mapper les infos du profil si présent
        if (user.getProfile() != null) {
            this.nom = user.getProfile().getNom();
            this.adresse = user.getProfile().getAdresse();
            this.telephone = user.getProfile().getTelephone();
        }
    }
    public UserDto(Long id) {
        this.id  = id;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    
    }
    public String getEmail() {
        return this.email;
    }
    public void setEmail(String email) {
         this.email = email;
    }
    @Override
    public String toString() {
        return "UserDto [id=" + id + ", email=" + email + ", username=" + username + ", role=" + role + ", createdAt="
                + createdAt + ", status=" + status + ", password=" + password + ", nom=" + nom + ", adresse=" + adresse + ", telephone=" + telephone + "]";
    }

    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getAdresse() {
        return adresse;
    }
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }





    
    
    
}
