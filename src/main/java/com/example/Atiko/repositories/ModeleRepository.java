package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.example.Atiko.entities.Modele;

import java.util.List;

@Repository
public interface ModeleRepository extends JpaRepository<Modele, Long> {

    // Rechercher par nom
    List<Modele> findByNomContainingIgnoreCase(String nom);

    // Rechercher par catégorie
    List<Modele> findByCategorieId(Long categorieId);

    // Rechercher par marque
    List<Modele> findByMarqueId(Long marqueId);

    // Rechercher par statut
    List<Modele> findByStatut(Boolean statut);

    // Rechercher par type moteur
    List<Modele> findByTypeMoteur(String typeMoteur);

    // Rechercher par année de sortie
    List<Modele> findByAnneeSortie(Integer annee);

    // // Recherche avancée
    // @Query("SELECT m FROM Modele m WHERE " +
    //        "(:nom IS NULL OR m.nom LIKE %:nom%) AND " +
    //        "(:categorieId IS NULL OR m.categorieId = :categorieId) AND " +
    //        "(:marqueId IS NULL OR m.marqueId = :marqueId) AND " +
    //        "(:typeMoteur IS NULL OR m.typeMoteur = :typeMoteur) AND " +
    //        "(:statut IS NULL OR m.statut = :statut)")
    // List<Modele> findByFilters(
    //         @Param("nom") String nom,
    //         @Param("categorieId") Long categorieId,
    //         @Param("marqueId") Long marqueId,
    //         @Param("typeMoteur") String typeMoteur,
    //         @Param("statut") Boolean statut
    // );

    // Vérifier l'existence par nom et catégorie
    boolean existsByNomAndCategorieId(String nom, Long categorieId);
}