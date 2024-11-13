package com.example.Atiko.dtos;

import java.util.Date;

public class StructureDto {
    private Long id;
    private String nom;
    private String telephone;
    private String email;
    private Date dateCreation;
    private String localisation;
    private String pays;
    private String ville;
    private String gps;
    private String logo;
    private String bio;
    private String description;
    private String img;
    private String img1;
    private String img2;
    private String facebook;
    private String youtube;
    private String twitter;
    private String instagram;




    public StructureDto(Long id, String nom, String telephone, String email, Date dateCreation, String localisation,
            String pays, String ville, String gps, String logo, String bio, String description, String img, String img1,
            String img2) {
        this.id = id;
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
        this.dateCreation = dateCreation;
        this.localisation = localisation;
        this.pays = pays;
        this.ville = ville;
        this.gps = gps;
        this.logo = logo;
        this.bio = bio;
        this.description = description;
        this.img = img;
        this.img1 = img1;
        this.img2 = img2;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public StructureDto() {
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
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
    public String getImg() {
        return img;
    }
    public void setImg(String img) {
        this.img = img;
    }
    public Date getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }
    public String getImg1() {
        return img1;
    }
    public void setImg1(String img1) {
        this.img1 = img1;
    }
    public String getImg2() {
        return img2;
    }
    public void setImg2(String img2) {
        this.img2 = img2;
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

    @Override
    public String toString() {
        return "StructureDto [id=" + id + ", nom=" + nom + ", telephone=" + telephone + ", email=" + email
                + ", dateCreation=" + dateCreation + ", localisation=" + localisation + ", pays=" + pays + ", ville="
                + ville + ", gps=" + gps + ", logo=" + logo + ", bio=" + bio + ", description=" + description + ", img="
                + img + ", img1=" + img1 + ", img2=" + img2 + "]";
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
