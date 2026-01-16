package com.example.Atiko.resources;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.VisiteTechniqueDto;
import com.example.Atiko.services.VisiteTechniqueService;

@RestController
@RequestMapping("/api/visites")
public class VisiteTechniqueResource {

    @Autowired
    private VisiteTechniqueService visiteService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<VisiteTechniqueDto> create(
        @RequestPart("visite") VisiteTechniqueDto dto,
        @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        return ResponseEntity.ok(visiteService.saveVisite(dto, file));
    }

    @PutMapping(path="/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<VisiteTechniqueDto> update(
        @PathVariable Long id,
        @RequestPart("visite") VisiteTechniqueDto dto,
        @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        return ResponseEntity.ok(visiteService.updateVisite(id, dto, file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisiteTechniqueDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(visiteService.findById(id));
    }

    @GetMapping("/voiture/{id}")
    public ResponseEntity<List<VisiteTechniqueDto>> listByVoiture(@PathVariable Long id) {
        return ResponseEntity.ok(visiteService.listByVoiture(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        visiteService.delete(id);
        return ResponseEntity.ok("Visite technique supprimée");
    }
}
