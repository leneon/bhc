package com.example.Atiko.services;
import com.example.Atiko.dtos.ReservationDto;
import com.example.Atiko.entities.Coupon;
import com.example.Atiko.entities.Reservation;
import com.example.Atiko.entities.User;
import com.example.Atiko.entities.Voiture;
import com.example.Atiko.repositories.CouponRepository;
import com.example.Atiko.repositories.ReservationRepository;
import com.example.Atiko.repositories.UserRepository;
import com.example.Atiko.repositories.VoitureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    
    public ReservationDto saveReservation(ReservationDto dto) {
        Reservation reservation = new Reservation();
        reservation.setDateReservation(dto.getDateReservation());
        reservation.setDateDebutPrevue(dto.getDateDebutPrevue());
        reservation.setDateFinPrevue(dto.getDateFinPrevue());
        reservation.setLieuDepart(dto.getLieuDepart());
        reservation.setLieuRetour(dto.getLieuRetour());
        
        // Conversion des enums avec gestion des valeurs null
        if (dto.getEtatReservation() != null && !dto.getEtatReservation().isEmpty()) {
            try {
                // Les enums sont en minuscules avec underscores (en_attente, confirmee, etc.)
                reservation.setEtatReservation(Reservation.EtatReservation.valueOf(dto.getEtatReservation().toLowerCase()));
            } catch (IllegalArgumentException e) {
                // Valeur par défaut si l'enum n'est pas valide
                reservation.setEtatReservation(Reservation.EtatReservation.en_attente);
            }
        }
        
        if (dto.getModePaiement() != null && !dto.getModePaiement().isEmpty()) {
            try {
                // Les enums sont en minuscules avec underscores (carte, cash, mobile_money, etc.)
                reservation.setModePaiement(Reservation.ModePaiement.valueOf(dto.getModePaiement().toLowerCase()));
            } catch (IllegalArgumentException e) {
                // Valeur par défaut si l'enum n'est pas valide
                reservation.setModePaiement(Reservation.ModePaiement.cash);
            }
        }
        
        reservation.setMontantTotal(dto.getMontantTotal());
        reservation.setAcompte(dto.getAcompte());
        reservation.setNotes(dto.getNotes());
        reservation.setRemise(dto.getRemise());
        reservation.setNombreJours(dto.getNombreJours());
        
        // Gestion du coupon
        if (dto.getCouponId() != null) {
            Optional<Coupon> couponOpt = couponRepository.findById(dto.getCouponId());
            couponOpt.ifPresent(coupon -> {
                reservation.setCoupon(coupon);
                // Incrémenter le nombre d'utilisations
                coupon.setNombreUtilisationsActuelles(coupon.getNombreUtilisationsActuelles() + 1);
                coupon.setUpdatedAt(java.time.LocalDateTime.now());
                couponRepository.save(coupon);
            });
        }
        // Relations
        Optional<User> client = userRepository.findById(dto.getClientId());
        Optional<Voiture> vehicule = voitureRepository.findById(dto.getVehiculeId());
        client.ifPresent(reservation::setClient);
        vehicule.ifPresent(reservation::setVehicule);
        Reservation saved = reservationRepository.save(reservation);
        return toDto(saved);
    }

    
    public ReservationDto getReservation(Long id) {
        return reservationRepository.findById(id)
            .map(this::toDto)
            .orElse(null);
    }

    
    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
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
