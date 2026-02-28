package com.example.Atiko.services;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.VisiteTechniqueDto;
import com.example.Atiko.entities.VisiteTechnique;
import com.example.Atiko.entities.Voiture;
import com.example.Atiko.repositories.VisiteTechniqueRepository;
import com.example.Atiko.repositories.VoitureRepository;

@Service
public class VisiteTechniqueService {

    @Autowired
    private VisiteTechniqueRepository visiteRepo;

    @Autowired
    private VoitureRepository voitureRepo;

    @Autowired
    private FileStorageService fileStorageService;

    // ----------------------------
    // CREATE
    // ----------------------------
    public VisiteTechniqueDto saveVisite(VisiteTechniqueDto dto, MultipartFile file) throws IOException {

        Voiture voiture = voitureRepo.findById(dto.getVoitureId())
                .orElseThrow(() -> new RuntimeException("Voiture introuvable"));

        VisiteTechnique visite = new VisiteTechnique();
        mapDtoToEntity(dto, visite);
        visite.setVoiture(voiture);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file, "visites-techniques");
            visite.setDocument(fileName);
        }

        visite.calculateStatut();
        visite = visiteRepo.save(visite);

        return mapEntityToDto(visite);
    }

    // ----------------------------
    // UPDATE
    // ----------------------------
    public VisiteTechniqueDto updateVisite(Long id, VisiteTechniqueDto dto, MultipartFile file) throws IOException {

        VisiteTechnique visite = visiteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Visite introuvable"));

        mapDtoToEntity(dto, visite);

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file, "visites-techniques");
            visite.setDocument(fileName);
        }

        visite.calculateStatut();
        visite = visiteRepo.save(visite);

        return mapEntityToDto(visite);
    }

    // ----------------------------
    // GET BY ID
    // ----------------------------
    public VisiteTechniqueDto findById(Long id) {
        VisiteTechnique visite = visiteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Visite introuvable"));
        return mapEntityToDto(visite);
    }

    // ----------------------------
    // LISTE PAR VOITURE
    // ----------------------------
    public List<VisiteTechniqueDto> listByVoiture(Long voitureId) {
        return visiteRepo.findByVoitureIdOrderByDateFinDesc(voitureId)
                .stream()
                .map(this::mapEntityToDto) 
                .toList();
    }

    // ----------------------------
    // DELETE
    // ----------------------------
    public void delete(Long id) {
        if (!visiteRepo.existsById(id)) {
            throw new RuntimeException("Visite introuvable");
        }
        visiteRepo.deleteById(id);
    }

    // ----------------------------
    // MAPPING DTO → ENTITY
    // ----------------------------
    private void mapDtoToEntity(VisiteTechniqueDto dto, VisiteTechnique visite) {
        visite.setCentre(dto.getCentre());
        visite.setNumero(dto.getNumero());
        visite.setDateDebut(dto.getDateDebut());
        visite.setDateFin(dto.getDateFin());
    }

    // ----------------------------
    // MAPPING ENTITY → DTO
    // ----------------------------
    private VisiteTechniqueDto mapEntityToDto(VisiteTechnique visite) {
        VisiteTechniqueDto dto = new VisiteTechniqueDto();

        dto.setId(visite.getId());
        dto.setCentre(visite.getCentre());
        dto.setNumero(visite.getNumero());
        dto.setDateDebut(visite.getDateDebut());
        dto.setDateFin(visite.getDateFin());
        dto.setDocument(visite.getDocument());
        dto.setVoitureId(visite.getVoiture().getId());
        dto.setStatut(visite.getStatut());

        return dto;
    }
}
