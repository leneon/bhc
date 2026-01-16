package com.example.Atiko.payload.request;

import java.util.Set;

import jakarta.validation.constraints.*;

public class SignupRequest {
  // Champs du profil utilisateur
  private String nom;
  private String prenoms;
  private String telephone;
  private String adresse;
  private String localisation;
  private String fonction;
  private String typePieceIdentite;
  private String numeroPieceIdentite;
  private String numeroPermisConduire;
  private String paysDelivrancePermis;
  private java.time.LocalDate dateDelivrancePermis;
  private java.time.LocalDate dateExpirationPermis;
  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }
  public String getPrenoms() { return prenoms; }
  public void setPrenoms(String prenoms) { this.prenoms = prenoms; }
  public String getTelephone() { return telephone; }
  public void setTelephone(String telephone) { this.telephone = telephone; }
  public String getAdresse() { return adresse; }
  public void setAdresse(String adresse) { this.adresse = adresse; }
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
  @NotBlank
  // @Size(min = 3, max = 20)
  private String username;

  @NotBlank
 
  @Email
  private String email;

  private Set<String> role;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<String> getRole() {
    return this.role;
  }

  public void setRole(Set<String> role) {
    this.role = role;
  }
}
