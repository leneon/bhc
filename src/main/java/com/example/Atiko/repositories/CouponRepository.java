package com.example.Atiko.repositories;

import com.example.Atiko.entities.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
    
    List<Coupon> findByActifTrue();
    
    List<Coupon> findByActifTrueAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(
        LocalDate date, LocalDate date2
    );
    
    List<Coupon> findByCodeContainingIgnoreCase(String code);
}



