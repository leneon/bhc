package com.example.Atiko.services;

import com.example.Atiko.dtos.CouponDto;
import com.example.Atiko.entities.Coupon;
import com.example.Atiko.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CouponService {
    
    private final CouponRepository couponRepository;
    
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public List<CouponDto> getActiveCoupons() {
        LocalDate now = LocalDate.now();
        return couponRepository.findByActifTrueAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(now, now)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public CouponDto getCouponById(Long id) {
        return couponRepository.findById(id)
            .map(this::convertToDto)
            .orElseThrow(() -> new IllegalArgumentException("Coupon non trouvé"));
    }
    
    public CouponDto getCouponByCode(String code) {
        return couponRepository.findByCode(code)
            .map(this::convertToDto)
            .orElseThrow(() -> new IllegalArgumentException("Coupon non trouvé"));
    }
    
    public CouponDto validateCoupon(String code, BigDecimal montantTotal) {
        Coupon coupon = couponRepository.findByCode(code)
            .orElseThrow(() -> new IllegalArgumentException("Code coupon invalide"));
        
        // Vérifier si le coupon est actif
        if (!coupon.getActif()) {
            throw new IllegalArgumentException("Ce coupon n'est plus actif");
        }
        
        // Vérifier les dates
        LocalDate now = LocalDate.now();
        if (now.isBefore(coupon.getDateDebut()) || now.isAfter(coupon.getDateFin())) {
            throw new IllegalArgumentException("Ce coupon a expiré ou n'est pas encore valide");
        }
        
        // Vérifier le nombre d'utilisations
        if (coupon.getNombreUtilisationsMax() != null && 
            coupon.getNombreUtilisationsActuelles() >= coupon.getNombreUtilisationsMax()) {
            throw new IllegalArgumentException("Ce coupon a atteint son nombre maximum d'utilisations");
        }
        
        // Vérifier le montant minimum
        if (coupon.getMontantMinimum() != null && montantTotal.compareTo(coupon.getMontantMinimum()) < 0) {
            throw new IllegalArgumentException("Le montant minimum requis pour ce coupon est de " + 
                coupon.getMontantMinimum() + " FCFA");
        }
        
        return convertToDto(coupon);
    }
    
    public CouponDto createCoupon(CouponDto dto) {
        // Vérifier l'unicité du code
        if (couponRepository.findByCode(dto.getCode()).isPresent()) {
            throw new IllegalArgumentException("Un coupon avec ce code existe déjà");
        }
        
        Coupon coupon = convertToEntity(dto);
        coupon = couponRepository.save(coupon);
        return convertToDto(coupon);
    }
    
    public CouponDto updateCoupon(Long id, CouponDto dto) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Coupon non trouvé"));
        
        // Vérifier l'unicité du code si changé
        if (!coupon.getCode().equals(dto.getCode()) && 
            couponRepository.findByCode(dto.getCode()).isPresent()) {
            throw new IllegalArgumentException("Un coupon avec ce code existe déjà");
        }
        
        coupon.setCode(dto.getCode());
        coupon.setDescription(dto.getDescription());
        coupon.setMontant(dto.getMontant());
        coupon.setTypeReduction(dto.getTypeReduction());
        coupon.setDateDebut(dto.getDateDebut());
        coupon.setDateFin(dto.getDateFin());
        coupon.setNombreUtilisationsMax(dto.getNombreUtilisationsMax());
        coupon.setActif(dto.getActif());
        coupon.setMontantMinimum(dto.getMontantMinimum());
        coupon.setUpdatedAt(java.time.LocalDateTime.now());
        
        coupon = couponRepository.save(coupon);
        return convertToDto(coupon);
    }
    
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
    
    public void incrementUtilisation(String code) {
        Coupon coupon = couponRepository.findByCode(code)
            .orElseThrow(() -> new IllegalArgumentException("Coupon non trouvé"));
        
        coupon.setNombreUtilisationsActuelles(
            coupon.getNombreUtilisationsActuelles() + 1
        );
        coupon.setUpdatedAt(java.time.LocalDateTime.now());
        couponRepository.save(coupon);
    }
    
    private CouponDto convertToDto(Coupon coupon) {
        CouponDto dto = new CouponDto();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setDescription(coupon.getDescription());
        dto.setMontant(coupon.getMontant());
        dto.setTypeReduction(coupon.getTypeReduction());
        dto.setDateDebut(coupon.getDateDebut());
        dto.setDateFin(coupon.getDateFin());
        dto.setNombreUtilisationsMax(coupon.getNombreUtilisationsMax());
        dto.setNombreUtilisationsActuelles(coupon.getNombreUtilisationsActuelles());
        dto.setActif(coupon.getActif());
        dto.setMontantMinimum(coupon.getMontantMinimum());
        dto.setCreatedAt(coupon.getCreatedAt());
        dto.setUpdatedAt(coupon.getUpdatedAt());
        return dto;
    }
    
    private Coupon convertToEntity(CouponDto dto) {
        Coupon coupon = new Coupon();
        coupon.setCode(dto.getCode());
        coupon.setDescription(dto.getDescription());
        coupon.setMontant(dto.getMontant());
        coupon.setTypeReduction(dto.getTypeReduction());
        coupon.setDateDebut(dto.getDateDebut());
        coupon.setDateFin(dto.getDateFin());
        coupon.setNombreUtilisationsMax(dto.getNombreUtilisationsMax());
        coupon.setNombreUtilisationsActuelles(0);
        coupon.setActif(dto.getActif() != null ? dto.getActif() : true);
        coupon.setMontantMinimum(dto.getMontantMinimum());
        return coupon;
    }
}



