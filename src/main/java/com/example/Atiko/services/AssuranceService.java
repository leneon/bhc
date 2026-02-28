package com.example.Atiko.services;

import com.example.Atiko.dtos.AssuranceDto;
import com.example.Atiko.entities.Assurance;
import com.example.Atiko.entities.Voiture;
import com.example.Atiko.repositories.AssuranceRepository;
import com.example.Atiko.repositories.VoitureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssuranceService {

    @Autowired
    private AssuranceRepository assuranceRepository;

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private FileStorageService fileStorageService;



    // --------------------------------------------------------------------
    // 🔵 Convert Entity → DTO
    // --------------------------------------------------------------------
    private AssuranceDto toDto(Assurance a) {
        AssuranceDto dto = new AssuranceDto();
        dto.setId(a.getId());
        dto.setCompagnie(a.getCompagnie());
        dto.setNumeroPolice(a.getNumeroPolice());
        dto.setType(a.getType());
        dto.setDateDebut(a.getDateDebut());
        dto.setDateFin(a.getDateFin());
        dto.setMontant(a.getMontant());
        dto.setDocument(a.getDocument());
        dto.setVoitureId(a.getVoiture() != null ? a.getVoiture().getId() : null);
        dto.setStatut(a.getStatut());     // si @Transient est utilisé
        return dto;
    }


    // --------------------------------------------------------------------
    // 🔵 Save (Create)
    // --------------------------------------------------------------------
    public AssuranceDto saveAssurance(AssuranceDto dto, MultipartFile file) throws IOException {

        Assurance assurance = new Assurance();

        if (dto.getId() != null) {
            assurance = assuranceRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Assurance introuvable"));
        }

        assurance.setCompagnie(dto.getCompagnie());
        assurance.setNumeroPolice(dto.getNumeroPolice());
        assurance.setType(dto.getType());
        assurance.setDateDebut(dto.getDateDebut());
        assurance.setDateFin(dto.getDateFin());
        assurance.setMontant(dto.getMontant());

        // 📁 Upload document
        if (file != null && !file.isEmpty()) {
            assurance.setDocument(fileStorageService.storeFile(file, "assurances"));
        }

        // 🔗 Attach voiture
        Voiture voiture = voitureRepository.findById(dto.getVoitureId())
                .orElseThrow(() -> new RuntimeException("Voiture introuvable"));
        assurance.setVoiture(voiture);

        assurance = assuranceRepository.save(assurance);
        return toDto(assurance);
    }



    // --------------------------------------------------------------------
    // 🔵 Update
    // --------------------------------------------------------------------
    public AssuranceDto updateAssurance(Long id, AssuranceDto dto, MultipartFile file) throws IOException {

        Assurance assurance = assuranceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assurance introuvable"));

        assurance.setCompagnie(dto.getCompagnie());
        assurance.setNumeroPolice(dto.getNumeroPolice());
        assurance.setType(dto.getType());
        assurance.setDateDebut(dto.getDateDebut());
        assurance.setDateFin(dto.getDateFin());
        assurance.setMontant(dto.getMontant());

        // 📁 Nouveau document si upload
        if (file != null && !file.isEmpty()) {
            assurance.setDocument(fileStorageService.storeFile(file, "assurances"));
        }

        // 🔗 Mise à jour voiture
        if (dto.getVoitureId() != null) {
            Voiture voiture = voitureRepository.findById(dto.getVoitureId())
                    .orElseThrow(() -> new RuntimeException("Voiture introuvable"));
            assurance.setVoiture(voiture);
        }

        assurance = assuranceRepository.save(assurance);
        return toDto(assurance);
    }


    public AssuranceDto findById(Long id) {
        Assurance assurance = assuranceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assurance introuvable"));

        return toDto(assurance);
    }


    public List<AssuranceDto> listAll() {
        return assuranceRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    public void delete(Long id) {
        assuranceRepository.deleteById(id);
    }


    public List<AssuranceDto> findByVoiture(Long voitureId) {
    return assuranceRepository.findByVoitureId(voitureId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
}

}

