package com.example.Atiko.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "structures")
public class Structure {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column
    private Long id;
    @Column(nullable = true)
    private String nom;
    @Column(nullable = true)
    private String telephone;
    @Column(nullable = true)
    private String email;
    @Column(name = "date_creation", nullable = true)
    private Date  dateCreation;
    @Column(nullable = true)
    private String pays;
    @Column(nullable = true)
    private String ville;
    @Column(nullable = true)
    private String localisation;
    @Column(nullable = true)
    private String gps;
    @Column(nullable = true)
    private String logo;
    @Column(columnDefinition = "TEXT", nullable = true)  // Utilise le type TEXT
    private String bio;
    @Column(columnDefinition = "TEXT", nullable = true)  // Utilise le type TEXT
    private String description;
    @Column(nullable = true)
    private String img;
    @Column(nullable = true)
    private String img1;
    @Column(nullable = true)
    private String img2;
    @Column(nullable = true)
    private String facebook;
    @Column(nullable = true)
    private String youtube;
    @Column(nullable = true)
    private String twitter;
    @Column(nullable = true)
    private String instagram;    

    public Date getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Structure() {
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
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getLocalisation() {
        return localisation;
    }
    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }
    public String getGps() {
        return gps;
    }
    public void setGps(String gps) {
        this.gps = gps;
    }
    public String getLogo() {
        return logo;
    }
    public void setLogo(String logo) {
        this.logo = logo;
    }
    public String getImg() {
        return img;
    }
    public void setImg(String img) {
        this.img = img;
    }
    public String getImg1() {
        return img1;
    }
    public void setImg1(String img) {
        this.img1 = img;
    }
    public String getImg2() {
        return img2;
    }
    public void setImg2(String img) {
        this.img2 = img;
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
    public String getFacebook() {
        return facebook;
    }
    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }
    public String getYoutube() {
        return youtube;
    }
    public void setYoutube(String youtube) {
        this.youtube = youtube;
    }
    public String getTwitter() {
        return twitter;
    }
    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }
    public String getInstagram() {
        return instagram;
    }
    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    
    
}
