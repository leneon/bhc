package com.example.Atiko.repositories;

import com.example.Atiko.entities.Voiture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoitureRepository extends JpaRepository<Voiture, Long> {

    // ===============================
    //        RECHERCHES SIMPLES
    // ===============================
    List<Voiture> findByNomContainingIgnoreCase(String nom);

    List<Voiture> findByCouleurContainingIgnoreCase(String couleur);

    List<Voiture> findByDisponibilite(String disponibilite);

    List<Voiture> findByAutomatique(Boolean auto);

    List<Voiture> findByClimatisation(Boolean clim);

    List<Voiture> findByPrixBetween(Double min, Double max);

    List<Voiture> findByModeleId(Long modeleId);

    boolean existsByImmatriculation(String immatriculation);

    // ===============================
    //         CARTE GRISE
    // ===============================

    List<Voiture> findByNumeroCarteGriseContainingIgnoreCase(String numCg);

    List<Voiture> findByNumeroSerieVinContainingIgnoreCase(String vin);

    List<Voiture> findByProprietaireContainingIgnoreCase(String proprietaire);

    // ===============================
    //         RECHERCHE AVANCÉE
    // ===============================

    @Query("""
            SELECT v FROM Voiture v
            WHERE (:nom IS NULL OR LOWER(v.nom) LIKE LOWER(CONCAT('%', :nom, '%')))
            AND (:modeleId IS NULL OR v.modele.id = :modeleId)
            AND (:disponibilite IS NULL OR v.disponibilite = :disponibilite)
            AND (:prixMin IS NULL OR v.prix >= :prixMin)
            AND (:prixMax IS NULL OR v.prix <= :prixMax)
            AND (:automatique IS NULL OR v.automatique = :automatique)
            AND (:couleur IS NULL OR LOWER(v.couleur) LIKE LOWER(CONCAT('%', :couleur, '%')))
            """)
    List<Voiture> searchAdvanced(
            @Param("nom") String nom,
            @Param("modeleId") Long modeleId,
            @Param("disponibilite") String disponibilite,
            @Param("prixMin") Double prixMin,
            @Param("prixMax") Double prixMax,
            @Param("automatique") Boolean automatique,
            @Param("couleur") String couleur
    );

    // ===============================
    //            STATISTIQUES
    // ===============================

    long countByDisponibilite(String dispo);

    long countByAutomatiqueTrue();

    long countByClimatisationTrue();

    // ===============================
    //             RECENTS
    // ===============================

    List<Voiture> findTop20ByOrderByIdDesc();
}
