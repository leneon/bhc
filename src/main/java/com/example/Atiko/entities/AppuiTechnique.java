package com.example.Atiko.entities;

import java.util.Date;
import java.util.List;

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
@Table(name = "appui_techniques")
public class AppuiTechnique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  

    @Column(name = "nom_entreprise")
    private String nomEntreprise;
    @Column
    private String adresse;
    @Column(name = "secteur_activite")
    private String secteurActivite;
    @Column(name = "date_creation")
    private Date dateCreation;
    @Column
    private String nrc;
    @Column(name = "nbre_employe")
    private String nbreEmployer;
    @Column(name = "statut_juridique")
    private String statutJuridique;
    @Column
    private String pays;
    @Column
    private String email;
    @Column
    private String telephone;
    @Column(name="nom_responsable")
    private String nomResponsable;
    @Column(name = "fonction_responsable")
    private String fonctionResponsable;
    @Column
    private String site;
    @Column
    private String impact;
    @Column(name = "date_lancement")
    private Date dateLancement;
    @Column(columnDefinition = "TEXT")  // Utilise le type TEXT
    private String resume;
    @Column(columnDefinition = "TEXT")  // Utilise le type TEXT
    private String objectif;
    @Column(name = "type_appui")
    private String typeAppui;
    @Column(name="type_financement")
    private String typeFinancement;
    @Column(name="type_financement_autre")
    private String typeFinancementAutre;  
    @Column(name="montant_financement")
    private Double montantFinancement;
    @Column(name="niveau_projet")
    private String niveauProjet;
    @Column(name="utilisation")
    private String utilisation;
    @Column(name = "financment_anterieur")
    private Boolean financementAnterieur;
    @Column(name = "source_anterieur")
    private String sourceAnterieur;
    @Column(name = "montant_anterieur")
    private Double montantAnterieur;
    @Column(name="principauxDefis",columnDefinition = "TEXT")  // Utilise le type TEXT
    private String principauxDefis;
    @Column(name = "support_technique")    
    private String supportTechnique;
    @Column(name = "support_technique_autre")    
    private String supportTechniqueAutre;
    @OneToMany(mappedBy = "appuiTechnique", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Upload> files;
    public AppuiTechnique() {
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
    public List<Upload> getFiles() {
        return files;
    }
    public void setFiles(List<Upload> files) {
        this.files = files;
    }



}
