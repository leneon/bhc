package com.example.Atiko.resources;

import com.example.Atiko.dtos.AssuranceDto;
import com.example.Atiko.services.AssuranceService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/assurances")
public class AssuranceResource {

    @Autowired
    private AssuranceService assuranceService;

    // -----------------------------------------------------------
    // 🔵 Create
    // -----------------------------------------------------------
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<AssuranceDto> createAssurance(
            @RequestPart("assurance") AssuranceDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        AssuranceDto saved = assuranceService.saveAssurance(dto, file);
        return ResponseEntity.ok(saved);
    }


    // -----------------------------------------------------------
    // 🔵 Update
    // -----------------------------------------------------------
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<AssuranceDto> updateAssurance(
            @PathVariable Long id,
            @RequestPart("assurance") AssuranceDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        AssuranceDto updated = assuranceService.updateAssurance(id, dto, file);
        return ResponseEntity.ok(updated);
    }


    // -----------------------------------------------------------
    // 🔵 Find by ID
    // -----------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<AssuranceDto> getAssurance(@PathVariable Long id) {
        return ResponseEntity.ok(assuranceService.findById(id));
    }


    // -----------------------------------------------------------
    // 🔵 List all
    // -----------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<AssuranceDto>> getAllAssurances() {
        return ResponseEntity.ok(assuranceService.listAll());
    }


    // -----------------------------------------------------------
    // 🔵 List by Voiture
    // -----------------------------------------------------------
    @GetMapping("/voiture/{voitureId}")
    public ResponseEntity<List<AssuranceDto>> getAssurancesByVoiture(@PathVariable Long voitureId) {
        return ResponseEntity.ok(assuranceService.findByVoiture(voitureId));
    }


    // -----------------------------------------------------------
    // 🔵 Delete
    // -----------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssurance(@PathVariable Long id) {
        log.info("DELETE /api/assurances/{} - Suppression de la assurance", id);
        try {
            assuranceService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("assurances non trouvée - ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression de la assurances", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    
}
