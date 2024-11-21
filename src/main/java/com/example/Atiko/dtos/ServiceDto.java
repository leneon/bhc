package com.example.Atiko.dtos;

import com.example.Atiko.entities.Service;

public class ServiceDto {
    private Long id;
    private String nom;
    private  String description;
    private  String type;


    

    public ServiceDto(Service service) {
        this.id = service.getId();
        this.nom = service.getNom();
        this.description = service.getDescription();
        this.type = service.getType();
    }
    public ServiceDto() {
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
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}
