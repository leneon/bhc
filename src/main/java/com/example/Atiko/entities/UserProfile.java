    
package com.example.Atiko.entities;

import java.time.LocalDate;
import java.util.Random;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    // Informations administratives
    @Column(name = "type_piece_identite", nullable = true)
    private String typePieceIdentite; // CNI, passeport, etc.

    @Column(name = "numero_piece_identite", nullable = true)
    private String numeroPieceIdentite;

    @Column(name = "numero_permis_conduire", nullable = true)
    private String numeroPermisConduire;

    @Column(name = "date_delivrance_permis", nullable = true)
    private LocalDate dateDelivrancePermis;

    @Column(name = "date_expiration_permis", nullable = true)
    private LocalDate dateExpirationPermis;

    @Column(name = "pays_delivrance_permis", nullable = true)
    private String paysDelivrancePermis;

    @Id
    private Long id;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
        }
    }

    @Column(nullable = true) // Permet que le champ soit nul
    private String nom;

    @Column(nullable = true)
    private String prenoms;

    @Column(name = "date_naiss", nullable = true)
    private LocalDate dateNaiss;

    @Column(nullable = true)
    private String telephone;

    @Column(nullable = true)
    private String pays = "TOGO";

    @Column(nullable = true)
    private String ville;

    @Column(nullable = true)
    private String localisation;

    @Column(columnDefinition = "TEXT", nullable = true)  // Utilise le type TEXT
    private String bio; 

    @Column(nullable = true)
    private String fonction;

    @Column(nullable = true)
    private String avatar;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false) // 'nullable = false' car l'utilisateur est requis
    private User user;

    
    public void setUser(User user) {
        this.user = user;
    }
    public User getUser() {
        return user;
    }
    public UserProfile() {}

    // Getters & Setters pour les infos administratives
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
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
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
    public String getFonction() {
        return fonction;
    }
    public void setFonction(String fonction) {
        this.fonction = fonction;
    }
    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    // Pour la logique client : adresse = localisation
    public String getAdresse() {
        return getLocalisation();
    }
    public void setAdresse(String adresse) {
        setLocalisation(adresse);
    }
    @Override
    public String toString() {
    return "UserProfile [id=" + id + ", nom=" + nom + ", prenoms=" + prenoms + ", dateNaiss=" + dateNaiss
        + ", telephone=" + telephone + ", pays=" + pays + ", ville=" + ville + ", localisation=" + localisation
        + ", bio=" + bio + ", fonction=" + fonction + ", avatar=" + avatar + ", user=" + user.toString() + "]";
    }

    
}
