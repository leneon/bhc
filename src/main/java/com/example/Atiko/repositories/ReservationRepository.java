package com.example.Atiko.repositories;

import com.example.Atiko.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    /**
     * Trouve les réservations qui chevauchent avec une période donnée pour un véhicule
     * Exclut les réservations annulées et expirées
     */
    @Query("SELECT r FROM Reservation r WHERE r.vehicule.id = :vehiculeId " +
           "AND r.etatReservation <> :etatAnnulee " +
           "AND r.etatReservation <> :etatExpiree " +
           "AND ((r.dateDebutPrevue <= :dateFin AND r.dateFinPrevue >= :dateDebut))")
    List<Reservation> findOverlappingReservations(
        @Param("vehiculeId") Long vehiculeId,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin,
        @Param("etatAnnulee") Reservation.EtatReservation etatAnnulee,
        @Param("etatExpiree") Reservation.EtatReservation etatExpiree
    );
    
    /**
     * Trouve les réservations qui chevauchent avec une période donnée pour un véhicule
     * Exclut une réservation spécifique (utile pour la mise à jour)
     */
    @Query("SELECT r FROM Reservation r WHERE r.vehicule.id = :vehiculeId " +
           "AND r.reservationId != :excludeReservationId " +
           "AND r.etatReservation <> :etatAnnulee " +
           "AND r.etatReservation <> :etatExpiree " +
           "AND ((r.dateDebutPrevue <= :dateFin AND r.dateFinPrevue >= :dateDebut))")
    List<Reservation> findOverlappingReservationsExcluding(
        @Param("vehiculeId") Long vehiculeId,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin,
        @Param("excludeReservationId") Long excludeReservationId,
        @Param("etatAnnulee") Reservation.EtatReservation etatAnnulee,
        @Param("etatExpiree") Reservation.EtatReservation etatExpiree
    );
    
    /**
     * Trouve toutes les réservations d'un client
     */
    List<Reservation> findByClientIdOrderByDateReservationDesc(Long clientId);
    
    /**
     * Trouve toutes les réservations d'un véhicule
     */
    List<Reservation> findByVehiculeIdOrderByDateReservationDesc(Long vehiculeId);
    
    /**
     * Trouve les réservations par état
     */
    List<Reservation> findByEtatReservationOrderByDateReservationDesc(Reservation.EtatReservation etat);
    
    /**
     * Trouve les réservations dans une période donnée
     */
    @Query("SELECT r FROM Reservation r WHERE r.dateDebutPrevue >= :dateDebut AND r.dateFinPrevue <= :dateFin " +
           "ORDER BY r.dateReservation DESC")
    List<Reservation> findReservationsByDateRange(
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin
    );
    
    /**
     * Vérifie si un véhicule est disponible pour une période donnée
     */
    @Query("SELECT COUNT(r) = 0 FROM Reservation r WHERE r.vehicule.id = :vehiculeId " +
           "AND r.etatReservation <> :etatAnnulee " +
           "AND r.etatReservation <> :etatExpiree " +
           "AND ((r.dateDebutPrevue <= :dateFin AND r.dateFinPrevue >= :dateDebut))")
    boolean isVehiculeAvailable(
        @Param("vehiculeId") Long vehiculeId,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin,
        @Param("etatAnnulee") Reservation.EtatReservation etatAnnulee,
        @Param("etatExpiree") Reservation.EtatReservation etatExpiree
    );
}
