package com.example.Atiko.dtos;

public class ClientDto {
    private Long id;
    // Le username d'un client est son email
    private String email;
    private String nomComplet;
    private String adresse;
    private String telephone;
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

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    // Le mot de passe par défaut est "password" (à gérer côté service, non exposé ici)
}
