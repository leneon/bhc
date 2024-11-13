package com.example.Atiko.dtos;

import java.util.Date;
import java.util.List;

public class AppuiTechniqueDto {
    private Long id;
    private String nomEntreprise;
    private String adresse;
    private String secteurActivite;
    private Date dateCreation;
    private String nrc;
    private String nbreEmployer;
    private String statutJuridique;
    private String pays;
    private String email;
    private String telephone;
    private String nomResponsable;
    private String fonctionResponsable;
    private String site;
    private String impact;
    private Date dateLancement;
    private String resume;
    private String objectif;
    private String typeAppui;
    private String typeFinancement;
    private String typeFinancementAutre;
    private Double montantFinancement;
    private String niveauProjet;
    private String utilisation;
    private Boolean financementAnterieur;
    private String sourceAnterieur;
    private Double montantAnterieur;
    private String principauxDefis;
    private String supportTechnique;
    private String supportTechniqueAutre;
    private List<UploadDto> files;

    
    public AppuiTechniqueDto() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNomEntreprise() {
        return nomEntreprise;
    }
    public void setNomEntreprise(String nomEntreprise) {
        this.nomEntreprise = nomEntreprise;
    }
    public String getAdresse() {
        return adresse;
    }
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    public String getSecteurActivite() {
        return secteurActivite;
    }
    public void setSecteurActivite(String secteurActivite) {
        this.secteurActivite = secteurActivite;
    }
    public Date getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }
    public String getNrc() {
        return nrc;
    }
    public void setNrc(String nrc) {
        this.nrc = nrc;
    }
    public String getNbreEmployer() {
        return nbreEmployer;
    }
    public void setNbreEmployer(String nbreEmployer) {
        this.nbreEmployer = nbreEmployer;
    }
    public String getStatutJuridique() {
        return statutJuridique;
    }
    public void setStatutJuridique(String statutJuridique) {
        this.statutJuridique = statutJuridique;
    }
    public String getPays() {
        return pays;
    }
    public void setPays(String pays) {
        this.pays = pays;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getNomResponsable() {
        return nomResponsable;
    }
    public void setNomResponsable(String nomResponsable) {
        this.nomResponsable = nomResponsable;
    }
    public String getFonctionResponsable() {
        return fonctionResponsable;
    }
    public void setFonctionResponsable(String fonctionResponsable) {
        this.fonctionResponsable = fonctionResponsable;
    }
    public String getSite() {
        return site;
    }
    public void setSite(String site) {
        this.site = site;
    }
    public String getImpact() {
        return impact;
    }
    public void setImpact(String impact) {
        this.impact = impact;
    }
    public Date getDateLancement() {
        return dateLancement;
    }
    public void setDateLancement(Date dateLancement) {
        this.dateLancement = dateLancement;
    }
    public String getResume() {
        return resume;
    }
    public void setResume(String resume) {
        this.resume = resume;
    }
    public String getObjectif() {
        return objectif;
    }
    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }
    public String getTypeAppui() {
        return typeAppui;
    }
    public void setTypeAppui(String typeAppui) {
        this.typeAppui = typeAppui;
    }
    public String getTypeFinancement() {
        return typeFinancement;
    }
    public void setTypeFinancement(String typeFinancement) {
        this.typeFinancement = typeFinancement;
    }
    public String getTypeFinancementAutre() {
        return typeFinancementAutre;
    }
    public void setTypeFinancementAutre(String typeFinancementAutre) {
        this.typeFinancementAutre = typeFinancementAutre;
    }
    public Double getMontantFinancement() {
        return montantFinancement;
    }
    public void setMontantFinancement(Double montantFinancement) {
        this.montantFinancement = montantFinancement;
    }
    public String getNiveauProjet() {
        return niveauProjet;
    }
    public void setNiveauProjet(String niveauProjet) {
        this.niveauProjet = niveauProjet;
    }
    public String getUtilisation() {
        return utilisation;
    }
    public void setUtilisation(String utilisation) {
        this.utilisation = utilisation;
    }
    public Boolean getFinancementAnterieur() {
        return financementAnterieur;
    }
    public void setFinancementAnterieur(Boolean financementAnterieur) {
        this.financementAnterieur = financementAnterieur;
    }
    public String getSourceAnterieur() {
        return sourceAnterieur;
    }
    public void setSourceAnterieur(String sourceAnterieur) {
        this.sourceAnterieur = sourceAnterieur;
    }
    public Double getMontantAnterieur() {
        return montantAnterieur;
    }
    public void setMontantAnterieur(Double montantAnterieur) {
        this.montantAnterieur = montantAnterieur;
    }
    public String getPrincipauxDefis() {
        return principauxDefis;
    }
    public void setPrincipauxDefis(String principauxDefis) {
        this.principauxDefis = principauxDefis;
    }
    public String getSupportTechnique() {
        return supportTechnique;
    }
    public void setSupportTechnique(String supportTechnique) {
        this.supportTechnique = supportTechnique;
    }
    public String getSupportTechniqueAutre() {
        return supportTechniqueAutre;
    }
    public void setSupportTechniqueAutre(String supportTechniqueAutre) {
        this.supportTechniqueAutre = supportTechniqueAutre;
    }
    public List<UploadDto> getFiles() {
        return files;
    }
    public void setFiles(List<UploadDto> files) {
        this.files = files;
    }

    // Getters and setters
}
