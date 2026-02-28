package com.example.Atiko.services;
import com.example.Atiko.dtos.ReservationDto;
import com.example.Atiko.entities.Coupon;
import com.example.Atiko.entities.Disponibilite;
import com.example.Atiko.entities.Reservation;
import com.example.Atiko.entities.User;
import com.example.Atiko.entities.Voiture;
import com.example.Atiko.repositories.CouponRepository;
import com.example.Atiko.repositories.ReservationRepository;
import com.example.Atiko.repositories.UserRepository;
import com.example.Atiko.repositories.VoitureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VoitureRepository voitureRepository;
    @Autowired
    private CouponRepository couponRepository;

    private static boolean isPaiementTotal(BigDecimal montantTotal, BigDecimal acompte) {
        if (montantTotal == null || acompte == null) return false;
        return acompte.compareTo(montantTotal) >= 0;
    }

    private void syncVehiculeDisponibilite(Voiture vehicule, Reservation.EtatReservation etat) {
        if (vehicule == null) return;

        if (etat == Reservation.EtatReservation.confirmee) {
            vehicule.setDisponibilite(Disponibilite.LOUE.name());
        } else {
            // Pour le moment: hors location, on remet disponible.
            // La disponibilité réelle est aussi protégée par la règle de chevauchement côté réservation.
            vehicule.setDisponibilite(Disponibilite.DISPONIBLE.name());
        }

        voitureRepository.save(vehicule);
    }

    /**
     * Valide les données d'une réservation
     */
    private void validateReservation(ReservationDto dto, Long excludeReservationId) {
        // Validation des champs obligatoires
        if (dto.getClientId() == null) {
            throw new IllegalArgumentException("Le client est obligatoire");
        }
        if (dto.getVehiculeId() == null) {
            throw new IllegalArgumentException("Le véhicule est obligatoire");
        }
        if (dto.getDateDebutPrevue() == null) {
            throw new IllegalArgumentException("La date de début prévue est obligatoire");
        }
        if (dto.getDateFinPrevue() == null) {
            throw new IllegalArgumentException("La date de fin prévue est obligatoire");
        }
        
        // Validation des dates
        if (dto.getDateDebutPrevue().isAfter(dto.getDateFinPrevue())) {
            throw new IllegalArgumentException("La date de début doit être antérieure à la date de fin");
        }

        // En création: on évite une date de début dans le passé.
        // En mise à jour: on autorise (ex: location en cours, clôture, etc.)
        if (excludeReservationId == null && dto.getDateDebutPrevue().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La date de début ne peut pas être dans le passé");
        }

        // Si on annule/expire une réservation, on n'a pas besoin de contrôler la disponibilité
        if (dto.getEtatReservation() != null && !dto.getEtatReservation().isEmpty()) {
            try {
                Reservation.EtatReservation etat = Reservation.EtatReservation.valueOf(dto.getEtatReservation().toLowerCase());
                if (etat == Reservation.EtatReservation.annulee || etat == Reservation.EtatReservation.expiree) {
                    return;
                }
            } catch (IllegalArgumentException ignored) {
                // Si état invalide, on continue la validation normale
            }
        }
        
        // Vérifier que le client existe
        if (!userRepository.existsById(dto.getClientId())) {
            throw new IllegalArgumentException("Le client spécifié n'existe pas");
        }
        
        // Vérifier que le véhicule existe
        Optional<Voiture> vehiculeOpt = voitureRepository.findById(dto.getVehiculeId());
        if (vehiculeOpt.isEmpty()) {
            throw new IllegalArgumentException("Le véhicule spécifié n'existe pas");
        }
        
        Voiture vehicule = vehiculeOpt.get();
        if (!vehicule.getStatut()) {
            throw new IllegalArgumentException("Le véhicule sélectionné n'est pas actif");
        }
        
        // Vérifier la disponibilité du véhicule
        boolean isAvailable;
        Reservation.EtatReservation etatAnnulee = Reservation.EtatReservation.annulee;
        Reservation.EtatReservation etatExpiree = Reservation.EtatReservation.expiree;
        
        if (excludeReservationId != null) {
            List<Reservation> overlapping = reservationRepository.findOverlappingReservationsExcluding(
                dto.getVehiculeId(), dto.getDateDebutPrevue(), dto.getDateFinPrevue(), 
                excludeReservationId, etatAnnulee, etatExpiree);
            isAvailable = overlapping.isEmpty();
        } else {
            isAvailable = reservationRepository.isVehiculeAvailable(
                dto.getVehiculeId(), dto.getDateDebutPrevue(), dto.getDateFinPrevue(), 
                etatAnnulee, etatExpiree);
        }
        
        if (!isAvailable) {
            throw new IllegalStateException("Le véhicule n'est pas disponible pour la période sélectionnée");
        }
    }

    /**
     * Crée une nouvelle réservation
     */
    @Transactional
    public ReservationDto saveReservation(ReservationDto dto) {
        // Validation
        validateReservation(dto, null);
        
        Reservation reservation = new Reservation();
        
        // Date de réservation (par défaut maintenant si non fournie)
        reservation.setDateReservation(dto.getDateReservation() != null 
            ? dto.getDateReservation() 
            : LocalDateTime.now());
        
        reservation.setDateDebutPrevue(dto.getDateDebutPrevue());
        reservation.setDateFinPrevue(dto.getDateFinPrevue());
        reservation.setLieuDepart(dto.getLieuDepart());
        reservation.setLieuRetour(dto.getLieuRetour());
        
        // Conversion des enums avec gestion des valeurs null
        if (dto.getEtatReservation() != null && !dto.getEtatReservation().isEmpty()) {
            try {
                reservation.setEtatReservation(Reservation.EtatReservation.valueOf(dto.getEtatReservation().toLowerCase()));
            } catch (IllegalArgumentException e) {
                reservation.setEtatReservation(Reservation.EtatReservation.en_attente);
            }
        } else {
            reservation.setEtatReservation(Reservation.EtatReservation.en_attente);
        }
        
        if (dto.getModePaiement() != null && !dto.getModePaiement().isEmpty()) {
            try {
                reservation.setModePaiement(Reservation.ModePaiement.valueOf(dto.getModePaiement().toLowerCase()));
            } catch (IllegalArgumentException e) {
                reservation.setModePaiement(Reservation.ModePaiement.cash);
            }
        }
        
        reservation.setMontantTotal(dto.getMontantTotal());
        reservation.setAcompte(dto.getAcompte());
        reservation.setNotes(dto.getNotes());
        reservation.setRemise(dto.getRemise() != null ? dto.getRemise() : java.math.BigDecimal.ZERO);
        reservation.setNombreJours(dto.getNombreJours());

        // Règle métier: si paiement total => on valide automatiquement la réservation
        if (isPaiementTotal(reservation.getMontantTotal(), reservation.getAcompte())) {
            reservation.setEtatReservation(Reservation.EtatReservation.confirmee);
        }
        
        // Gestion du coupon
        if (dto.getCouponId() != null) {
            Optional<Coupon> couponOpt = couponRepository.findById(dto.getCouponId());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                reservation.setCoupon(coupon);
                // Incrémenter le nombre d'utilisations
                coupon.setNombreUtilisationsActuelles(coupon.getNombreUtilisationsActuelles() + 1);
                coupon.setUpdatedAt(LocalDateTime.now());
                couponRepository.save(coupon);
            }
        }
        
        // Relations
        User client = userRepository.findById(dto.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client introuvable"));
        Voiture vehicule = voitureRepository.findById(dto.getVehiculeId())
            .orElseThrow(() -> new IllegalArgumentException("Véhicule introuvable"));
        
        reservation.setClient(client);
        reservation.setVehicule(vehicule);

        // Si la réservation est validée => la voiture passe en LOUE
        syncVehiculeDisponibilite(vehicule, reservation.getEtatReservation());

        Reservation saved = reservationRepository.save(reservation);
        return toDto(saved);
    }

    /**
     * Met à jour une réservation existante
     */
    @Transactional
    public ReservationDto updateReservation(Long id, ReservationDto dto) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));

        Reservation.EtatReservation previousEtat = reservation.getEtatReservation();
        Voiture previousVehicule = reservation.getVehicule();
        
        // Validation
        validateReservation(dto, id);
        
        // Mise à jour des champs
        reservation.setDateReservation(dto.getDateReservation() != null 
            ? dto.getDateReservation() 
            : reservation.getDateReservation());
        reservation.setDateDebutPrevue(dto.getDateDebutPrevue());
        reservation.setDateFinPrevue(dto.getDateFinPrevue());
        reservation.setLieuDepart(dto.getLieuDepart());
        reservation.setLieuRetour(dto.getLieuRetour());
        
        // Conversion des enums
        if (dto.getEtatReservation() != null && !dto.getEtatReservation().isEmpty()) {
            try {
                reservation.setEtatReservation(Reservation.EtatReservation.valueOf(dto.getEtatReservation().toLowerCase()));
            } catch (IllegalArgumentException e) {
                // Garder l'état actuel si invalide
            }
        }
        
        if (dto.getModePaiement() != null && !dto.getModePaiement().isEmpty()) {
            try {
                reservation.setModePaiement(Reservation.ModePaiement.valueOf(dto.getModePaiement().toLowerCase()));
            } catch (IllegalArgumentException e) {
                // Garder le mode actuel si invalide
            }
        }
        
        if (dto.getMontantTotal() != null) {
            reservation.setMontantTotal(dto.getMontantTotal());
        }
        if (dto.getAcompte() != null) {
            reservation.setAcompte(dto.getAcompte());
        }
        reservation.setNotes(dto.getNotes());
        if (dto.getRemise() != null) {
            reservation.setRemise(dto.getRemise());
        }
        if (dto.getNombreJours() != null) {
            reservation.setNombreJours(dto.getNombreJours());
        }

        // Règle métier: si paiement total => on valide automatiquement la réservation
        if (isPaiementTotal(reservation.getMontantTotal(), reservation.getAcompte())) {
            reservation.setEtatReservation(Reservation.EtatReservation.confirmee);
        }
        
        // Gestion du coupon
        if (dto.getCouponId() != null) {
            Optional<Coupon> couponOpt = couponRepository.findById(dto.getCouponId());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                // Décrémenter l'ancien coupon si différent
                if (reservation.getCoupon() != null && !reservation.getCoupon().getId().equals(coupon.getId())) {
                    Coupon oldCoupon = reservation.getCoupon();
                    oldCoupon.setNombreUtilisationsActuelles(Math.max(0, oldCoupon.getNombreUtilisationsActuelles() - 1));
                    couponRepository.save(oldCoupon);
                }
                reservation.setCoupon(coupon);
                coupon.setNombreUtilisationsActuelles(coupon.getNombreUtilisationsActuelles() + 1);
                coupon.setUpdatedAt(LocalDateTime.now());
                couponRepository.save(coupon);
            }
        } else if (reservation.getCoupon() != null) {
            // Retirer le coupon
            Coupon oldCoupon = reservation.getCoupon();
            oldCoupon.setNombreUtilisationsActuelles(Math.max(0, oldCoupon.getNombreUtilisationsActuelles() - 1));
            couponRepository.save(oldCoupon);
            reservation.setCoupon(null);
        }
        
        // Relations
        if (dto.getClientId() != null) {
            User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable"));
            reservation.setClient(client);
        }
        if (dto.getVehiculeId() != null) {
            Voiture vehicule = voitureRepository.findById(dto.getVehiculeId())
                .orElseThrow(() -> new IllegalArgumentException("Véhicule introuvable"));
            reservation.setVehicule(vehicule);
        }

        Reservation saved = reservationRepository.save(reservation);

        // Sync disponibilité voiture(s) en fonction du statut final
        Voiture currentVehicule = saved.getVehicule();
        if (currentVehicule != null) {
            syncVehiculeDisponibilite(currentVehicule, saved.getEtatReservation());
        }

        // Si la voiture a changé ou si on sort d'une réservation confirmée, libérer l'ancienne voiture
        if (previousVehicule != null && (currentVehicule == null || !previousVehicule.getId().equals(currentVehicule.getId()))) {
            syncVehiculeDisponibilite(previousVehicule, Reservation.EtatReservation.en_attente);
        } else if (previousVehicule != null && previousEtat == Reservation.EtatReservation.confirmee && saved.getEtatReservation() != Reservation.EtatReservation.confirmee) {
            syncVehiculeDisponibilite(previousVehicule, saved.getEtatReservation());
        }

        return toDto(saved);
    }

    /**
     * Récupère une réservation par son ID
     */
    public ReservationDto getReservation(Long id) {
        return reservationRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));
    }

    /**
     * Récupère toutes les réservations
     */
    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Récupère les réservations d'un client
     */
    public List<ReservationDto> getReservationsByClient(Long clientId) {
        return reservationRepository.findByClientIdOrderByDateReservationDesc(clientId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Récupère les réservations d'un véhicule
     */
    public List<ReservationDto> getReservationsByVehicule(Long vehiculeId) {
        return reservationRepository.findByVehiculeIdOrderByDateReservationDesc(vehiculeId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Récupère les réservations par état
     */
    public List<ReservationDto> getReservationsByEtat(String etat) {
        try {
            Reservation.EtatReservation etatReservation = Reservation.EtatReservation.valueOf(etat.toLowerCase());
            return reservationRepository.findByEtatReservationOrderByDateReservationDesc(etatReservation).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("État de réservation invalide: " + etat);
        }
    }
    
    /**
     * Vérifie la disponibilité d'un véhicule pour une période
     */
    public boolean checkVehiculeAvailability(Long vehiculeId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        return reservationRepository.isVehiculeAvailable(
            vehiculeId, dateDebut, dateFin, 
            Reservation.EtatReservation.annulee, 
            Reservation.EtatReservation.expiree);
    }

    /**
     * Supprime une réservation
     */
    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));
        
        // Décrémenter le coupon si présent
        if (reservation.getCoupon() != null) {
            Coupon coupon = reservation.getCoupon();
            coupon.setNombreUtilisationsActuelles(Math.max(0, coupon.getNombreUtilisationsActuelles() - 1));
            couponRepository.save(coupon);
        }
        
        Voiture vehicule = reservation.getVehicule();
        Reservation.EtatReservation etat = reservation.getEtatReservation();

        reservationRepository.deleteById(id);

        if (vehicule != null && etat == Reservation.EtatReservation.confirmee) {
            // Si on supprime une location (réservation confirmée), libérer la voiture
            syncVehiculeDisponibilite(vehicule, Reservation.EtatReservation.en_attente);
        }
    }

    private ReservationDto toDto(Reservation r) {
        ReservationDto dto = new ReservationDto();
        dto.setReservationId(r.getReservationId());
        dto.setClientId(r.getClient() != null ? r.getClient().getId() : null);
        dto.setVehiculeId(r.getVehicule() != null ? r.getVehicule().getId() : null);
        dto.setDateReservation(r.getDateReservation());
        dto.setDateDebutPrevue(r.getDateDebutPrevue());
        dto.setDateFinPrevue(r.getDateFinPrevue());
        dto.setLieuDepart(r.getLieuDepart());
        dto.setLieuRetour(r.getLieuRetour());
        dto.setEtatReservation(r.getEtatReservation() != null ? r.getEtatReservation().name() : null);
        dto.setModePaiement(r.getModePaiement() != null ? r.getModePaiement().name() : null);
        dto.setMontantTotal(r.getMontantTotal());
        dto.setAcompte(r.getAcompte());
        dto.setNotes(r.getNotes());
        dto.setRemise(r.getRemise());
        dto.setNombreJours(r.getNombreJours());
        
        // Informations du coupon
        if (r.getCoupon() != null) {
            dto.setCouponId(r.getCoupon().getId());
            dto.setCouponCode(r.getCoupon().getCode());
            dto.setCouponMontant(r.getCoupon().getMontant());
            dto.setCouponTypeReduction(r.getCoupon().getTypeReduction());
        }
        
        // Informations supplémentaires pour l'affichage
        if (r.getClient() != null) {
            dto.setClientNom(r.getClient().getUsername());
            dto.setClientEmail(r.getClient().getEmail());
        }
        if (r.getVehicule() != null) {
            dto.setVoitureNom(r.getVehicule().getNom());
            dto.setVoitureImmatriculation(r.getVehicule().getImmatriculation());
        }
        
        return dto;
    }
}
