package com.example.Atiko.services;
import com.example.Atiko.dtos.ReservationDto;
import com.example.Atiko.entities.Reservation;
import com.example.Atiko.entities.User;
import com.example.Atiko.entities.Voiture;
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

    
    public ReservationDto saveReservation(ReservationDto dto) {
        Reservation reservation = new Reservation();
        reservation.setDateReservation(dto.getDateReservation());
        reservation.setDateDebutPrevue(dto.getDateDebutPrevue());
        reservation.setDateFinPrevue(dto.getDateFinPrevue());
        reservation.setLieuDepart(dto.getLieuDepart());
        reservation.setLieuRetour(dto.getLieuRetour());
        reservation.setEtatReservation(Reservation.EtatReservation.valueOf(dto.getEtatReservation()));
        reservation.setModePaiement(Reservation.ModePaiement.valueOf(dto.getModePaiement()));
        reservation.setMontantTotal(dto.getMontantTotal());
        reservation.setAcompte(dto.getAcompte());
        reservation.setNotes(dto.getNotes());
        // Relations
        Optional<User> client = userRepository.findById(dto.getClientId());
        Optional<Voiture> vehicule = voitureRepository.findById(dto.getVehiculeId());
        client.ifPresent(reservation::setClient);
        vehicule.ifPresent(reservation::setVehicule);
        Reservation saved = reservationRepository.save(reservation);
        dto.setReservationId(saved.getReservationId());
        return dto;
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
        return dto;
    }
}
