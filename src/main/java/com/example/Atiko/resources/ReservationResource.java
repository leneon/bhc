package com.example.Atiko.resources;

import com.example.Atiko.dtos.ReservationDto;
import com.example.Atiko.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationResource {
    @Autowired
    private ReservationService reservationService;

    /**
     * Crée une nouvelle réservation
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationDto dto) {
        try {
            ReservationDto created = reservationService.saveReservation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors de la création de la réservation: " + e.getMessage()));
        }
    }

    /**
     * Met à jour une réservation existante
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ReservationDto dto) {
        try {
            ReservationDto updated = reservationService.updateReservation(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors de la mise à jour de la réservation: " + e.getMessage()));
        }
    }

    /**
     * Récupère une réservation par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        try {
            ReservationDto dto = reservationService.getReservation(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors de la récupération de la réservation: " + e.getMessage()));
        }
    }

    /**
     * Récupère toutes les réservations
     */
    @GetMapping
    public ResponseEntity<List<ReservationDto>> getAll(
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false) Long vehiculeId,
            @RequestParam(required = false) String etat) {
        try {
            List<ReservationDto> reservations;
            
            if (clientId != null) {
                reservations = reservationService.getReservationsByClient(clientId);
            } else if (vehiculeId != null) {
                reservations = reservationService.getReservationsByVehicule(vehiculeId);
            } else if (etat != null && !etat.isEmpty()) {
                reservations = reservationService.getReservationsByEtat(etat);
            } else {
                reservations = reservationService.getAllReservations();
            }
            
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Vérifie la disponibilité d'un véhicule pour une période
     */
    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam Long vehiculeId,
            @RequestParam String dateDebut,
            @RequestParam String dateFin) {
        try {
            LocalDateTime debut = LocalDateTime.parse(dateDebut);
            LocalDateTime fin = LocalDateTime.parse(dateFin);
            boolean available = reservationService.checkVehiculeAvailability(vehiculeId, debut, fin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("available", available);
            response.put("message", available ? "Véhicule disponible" : "Véhicule non disponible pour cette période");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Erreur lors de la vérification: " + e.getMessage()));
        }
    }

    /**
     * Supprime une réservation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors de la suppression de la réservation: " + e.getMessage()));
        }
    }
    
    /**
     * Crée une réponse d'erreur standardisée
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
