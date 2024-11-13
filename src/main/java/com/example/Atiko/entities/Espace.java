package com.example.Atiko.entities;

import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "espaces")
public class Espace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  
    @Column
    private String nom;
    @Column
    private String type;
    @Column
    private String description;
    @Column
    private Double tarif;
    @Column
    @ColumnDefault("true") // Valeur par défaut de true
    private Boolean statut;
    @Column
    private String img;
    @OneToMany(mappedBy = "espace", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Upload> paths;

    public List<Upload> getPaths() {
            return paths;
        }
        public void setPaths(List<Upload> paths) {
            this.paths = paths;
        }
    public String getImg() {
        return img;
    }
    public void setImg(String img) {
        this.img = img;
    }
    public Espace() {
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
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Double getTarif() {
        return tarif;
    }
    public void setTarif(Double tarif) {
        this.tarif = tarif;
    }
    public Boolean getStatut() {
        return statut;
    }
    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
    
    
}
