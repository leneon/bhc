package com.example.Atiko.resources;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.StructureDto;
import com.example.Atiko.entities.Structure;
import com.example.Atiko.services.StructureService;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/structures")
public class StructureResource {

    private final StructureService structureService;

    @Autowired
    public StructureResource(StructureService structureService) {
        this.structureService = structureService;
    }

    @GetMapping("/liste")
    public ResponseEntity<List<StructureDto>> getAllStructures() {
        List<StructureDto> structures = structureService.getAllStructures();
        if (structures.isEmpty()) {
            return ResponseEntity.noContent().build();  // 204 No Content si la liste est vide
        }
        return ResponseEntity.ok(structures);  // 200 OK avec la liste des structures
    }

    @GetMapping
    public ResponseEntity<StructureDto> getFirstStructure() {
        List<StructureDto> structures = structureService.getAllStructures();
        if (structures.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si aucune structure n'existe
        }
        
        // Trier par date de création et récupérer la première
        StructureDto firstStructure = structures.stream()
                .min(Comparator.comparing(StructureDto::getDateCreation))
                .orElse(null);
        
        return ResponseEntity.ok(firstStructure); // 200 OK avec la structure        
    }


    @GetMapping("/{id}")
    public ResponseEntity<StructureDto> getStructureById(@PathVariable Long id) {
        return structureService.getStructureById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public StructureDto createStructure(@RequestBody StructureDto structureDto) {
        return structureService.createStructure(structureDto);
    }

    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<StructureDto> updateStructure(
            @PathVariable Long id,
            @RequestPart("structureDto") StructureDto structureDto, 
            @RequestPart(value ="logo", required = false) MultipartFile logo,
            @RequestPart(value ="img", required = false) MultipartFile img,
            @RequestPart(value ="img1", required = false) MultipartFile img1,
            @RequestPart(value ="img2", required = false) MultipartFile img2) throws IOException{ 

        try {
           
            StructureDto updatedStructure = structureService.updateStructure(id, structureDto,logo,img,img1,img2);
            return ResponseEntity.ok(updatedStructure);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStructure(@PathVariable Long id) {
        structureService.deleteStructure(id);
        return ResponseEntity.noContent().build();
    }
}
