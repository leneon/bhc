package com.example.Atiko.dtos;

import java.time.LocalDate;

import com.example.Atiko.entities.UserProfile;


public class UserProfileDto {
    // Champs administratifs
    private String typePieceIdentite;
    private String numeroPieceIdentite;
    private String numeroPermisConduire;
    private LocalDate dateDelivrancePermis;
    private LocalDate dateExpirationPermis;
    private String paysDelivrancePermis;
    public String getTypePieceIdentite() { return typePieceIdentite; }
    public void setTypePieceIdentite(String typePieceIdentite) { this.typePieceIdentite = typePieceIdentite; }

    public String getNumeroPieceIdentite() { return numeroPieceIdentite; }
    public void setNumeroPieceIdentite(String numeroPieceIdentite) { this.numeroPieceIdentite = numeroPieceIdentite; }

    public String getNumeroPermisConduire() { return numeroPermisConduire; }
    public void setNumeroPermisConduire(String numeroPermisConduire) { this.numeroPermisConduire = numeroPermisConduire; }

    public LocalDate getDateDelivrancePermis() { return dateDelivrancePermis; }
    public void setDateDelivrancePermis(LocalDate dateDelivrancePermis) { this.dateDelivrancePermis = dateDelivrancePermis; }

    public LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public void setDateExpirationPermis(LocalDate dateExpirationPermis) { this.dateExpirationPermis = dateExpirationPermis; }

    public String getPaysDelivrancePermis() { return paysDelivrancePermis; }
    public void setPaysDelivrancePermis(String paysDelivrancePermis) { this.paysDelivrancePermis = paysDelivrancePermis; }

    private Long id;
    private String nom;
    private String prenoms;
    private LocalDate dateNaiss;
    private String telephone;
    private String pays;
    private String ville;
    private String localisation;
    private String fonction;
    private String avatar;
    private String bio;
    private UserDto user;
    
    public UserProfileDto() {
    }
    public UserProfileDto(UserProfile profile) {
        this.avatar = profile.getAvatar();
    }
    public UserDto getUser() {
        return user;
    }
    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    public void setUser(UserDto user) {
        this.user = user;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public String getFonction() {
        return fonction;
    }
    public void setFonction(String fonction) {
        this.fonction = fonction;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenoms() {
        return prenoms;
    }
    public void setPrenoms(String prenoms) {
        this.prenoms = prenoms;
    }
    public LocalDate getDateNaiss() {
        return dateNaiss;
    }
    public void setDateNaiss(LocalDate dateNaiss) {
        this.dateNaiss = dateNaiss;
    }
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getPays() {
        return pays;
    }
    public void setPays(String pays) {
        this.pays = pays;
    }
    public String getVille() {
        return ville;
    }
    public void setVille(String ville) {
        this.ville = ville;
    }
    public String getLocalisation() {
        return localisation;
    }
    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
    @Override
    public String toString() {
        return "ProfileDto [id=" + id + ", nom=" + nom + ", prenoms=" + prenoms + ", dateNaiss=" + dateNaiss
                + ", telephone=" + telephone + ", pays=" + pays + ", ville=" + ville + ", localisation=" + localisation
                + ", fonction=" + fonction + ", avatar=" + avatar + ", bio=" + bio + ", user=" + user.toString() + "]";
    }
    

}
