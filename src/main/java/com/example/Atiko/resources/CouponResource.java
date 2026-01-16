package com.example.Atiko.resources;

import com.example.Atiko.dtos.CouponDto;
import com.example.Atiko.services.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class CouponResource {
    
    private final CouponService couponService;
    
    @GetMapping
    public ResponseEntity<List<CouponDto>> getAllCoupons() {
        try {
            List<CouponDto> coupons = couponService.getAllCoupons();
            return ResponseEntity.ok(coupons);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des coupons", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<CouponDto>> getActiveCoupons() {
        try {
            List<CouponDto> coupons = couponService.getActiveCoupons();
            return ResponseEntity.ok(coupons);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des coupons actifs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CouponDto> getCouponById(@PathVariable Long id) {
        try {
            CouponDto coupon = couponService.getCouponById(id);
            return ResponseEntity.ok(coupon);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du coupon", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<CouponDto> getCouponByCode(@PathVariable String code) {
        try {
            CouponDto coupon = couponService.getCouponByCode(code);
            return ResponseEntity.ok(coupon);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du coupon", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<CouponDto> validateCoupon(
            @RequestParam String code,
            @RequestParam(required = false, defaultValue = "0") BigDecimal montantTotal) {
        try {
            CouponDto coupon = couponService.validateCoupon(code, montantTotal);
            return ResponseEntity.ok(coupon);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .header("X-Error-Message", e.getMessage())
                .build();
        } catch (Exception e) {
            log.error("Erreur lors de la validation du coupon", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<CouponDto> createCoupon(@RequestBody CouponDto dto) {
        try {
            CouponDto created = couponService.createCoupon(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .header("X-Error-Message", e.getMessage())
                .build();
        } catch (Exception e) {
            log.error("Erreur lors de la création du coupon", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CouponDto> updateCoupon(@PathVariable Long id, @RequestBody CouponDto dto) {
        try {
            CouponDto updated = couponService.updateCoupon(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .header("X-Error-Message", e.getMessage())
                .build();
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du coupon", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression du coupon", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}



