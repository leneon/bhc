package com.example.Atiko.repositories;

import com.example.Atiko.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // méthodes personnalisées si besoin
}
