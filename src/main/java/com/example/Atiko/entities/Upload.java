package com.example.Atiko.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "uploads")
public class Upload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = true)
    private String path;
    @Column(nullable = true)
    private String doc;
    
    @ManyToOne
    @JoinColumn(name = "uppui_technique_id", referencedColumnName = "id", nullable = false) // 'nullable = false' car l'utilisateur est requis
    private AppuiTechnique appuiTechnique;
    @ManyToOne
    @JoinColumn(name = "espace_id", referencedColumnName = "id", nullable = false) // 'nullable = false' car l'utilisateur est requis
    private Espace espace;
    public Upload() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public String getDoc() {
        return doc;
    }
    public void setDoc(String doc) {
        this.doc = doc;
    }
    public AppuiTechnique getAppuiTechnique() {
        return appuiTechnique;
    }
    public void setAppuiTechnique(AppuiTechnique appuiTechnique) {
        this.appuiTechnique = appuiTechnique;
    }
    public Espace getEspace() {
        return espace;
    }
    public void setEspace(Espace espace) {
        this.espace = espace;
    }

}
