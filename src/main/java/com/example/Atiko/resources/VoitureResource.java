package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.VoitureDto;
import com.example.Atiko.services.VoitureService;

import java.util.List;

@RestController
@RequestMapping("/api/voitures")
public class VoitureResource {

    @Autowired
    private VoitureService voitureService;

    @GetMapping
    public ResponseEntity<List<VoitureDto>> getAllVoitures() {
        List<VoitureDto> voitures = voitureService.getAllVoitures();
        return ResponseEntity.ok(voitures);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoitureDto> getVoitureById(@PathVariable Long id) {
        return voitureService.getVoitureById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VoitureDto> createVoiture(@RequestBody VoitureDto voitureDto) {
        try {
            VoitureDto createdVoiture = voitureService.createVoiture(voitureDto, null, null);
            return ResponseEntity.ok(createdVoiture);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/with-files")
    public ResponseEntity<VoitureDto> createVoitureWithFiles(@RequestPart("voiture") VoitureDto voitureDto,
                                                           @RequestPart(value = "image", required = false) MultipartFile image,
                                                           @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            VoitureDto createdVoiture = voitureService.createVoiture(voitureDto, image, images);
            return ResponseEntity.ok(createdVoiture);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoitureDto> updateVoiture(@PathVariable Long id,
                                                   @RequestBody VoitureDto voitureDto) {
        try {
            return voitureService.updateVoiture(id, voitureDto, null, null)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/with-files")
    public ResponseEntity<VoitureDto> updateVoitureWithFiles(@PathVariable Long id,
                                                            @RequestPart("voiture") VoitureDto voitureDto,
                                                            @RequestPart(value = "image", required = false) MultipartFile image,
                                                            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            return voitureService.updateVoiture(id, voitureDto, image, images)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoiture(@PathVariable Long id) {
        try {
            voitureService.deleteVoiture(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 