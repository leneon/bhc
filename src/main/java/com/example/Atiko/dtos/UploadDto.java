package com.example.Atiko.dtos;

public class UploadDto {
    private Long id;
    private String path;
    private String doc;
    private Long appuiTechniqueId;  // Id de l'entité AppuiTechnique associée

    
    public UploadDto() {
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
    public Long getAppuiTechniqueId() {
        return appuiTechniqueId;
    }
    public void setAppuiTechniqueId(Long appuiTechniqueId) {
        this.appuiTechniqueId = appuiTechniqueId;
    }

    // Getters et Setters
}
