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
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true) // Permet que le champ soit nul
    private String nom;

    @Column(nullable = true)
    private String prenoms;

    @Column(name = "date_naiss", nullable = true)
    private Date dateNaiss;

    @Column(nullable = true)
    private String telephone;

    @Column(nullable = true)
    private String pays;

    @Column(nullable = true)
    private String ville;

    @Column(nullable = true)
    private String localisation;

    @Column(nullable = true)
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
    public Profile() {
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
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenoms() {
        return prenoms;
    }
    public void setPrenoms(String prenoms) {
        this.prenoms = prenoms;
    }
    public Date getDateNaiss() {
        return dateNaiss;
    }
    public void setDateNaiss(Date dateNaiss) {
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
    @Override
    public String toString() {
        return "Profile [id=" + id + ", nom=" + nom + ", prenoms=" + prenoms + ", dateNaiss=" + dateNaiss
                + ", telephone=" + telephone + ", pays=" + pays + ", ville=" + ville + ", localisation=" + localisation
                + ", bio=" + bio + ", fonction=" + fonction + ", avatar=" + avatar + ", user=" + user.toString() + "]";
    }

    
}
