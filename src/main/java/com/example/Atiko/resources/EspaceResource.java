package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.ArticleDto;
import com.example.Atiko.dtos.EspaceDto;
import com.example.Atiko.dtos.UploadDto;
import com.example.Atiko.entities.Espace;
import com.example.Atiko.entities.Upload;
import com.example.Atiko.services.EspaceService;
import com.example.Atiko.services.UploadService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/espaces")
public class EspaceResource {

    @Autowired
    private EspaceService espaceService;

    @Autowired
    private UploadService uploadService;

    @GetMapping
    public List<EspaceDto> getAllEspaces() {
        return espaceService.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EspaceDto> getEspaceById(@PathVariable Long id) {
        return espaceService.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes ={ MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public EspaceDto createEspace(  @RequestPart("espaceDto") EspaceDto espaceDto,
                                    @RequestParam(value="couverture", required = false) MultipartFile couverture,
                                    @RequestParam(value="images", required = false) MultipartFile[] images ) {

        Espace espace = convertToEntity(espaceDto);
        espace = espaceService.save(espace,couverture,images);
        return convertToDto(espace);
    }

    @PutMapping(value="/{id}", consumes ={ MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<EspaceDto> updateEspace(   @PathVariable Long id,
                                                @RequestPart("espaceDto") EspaceDto espaceDto,
                                                @RequestParam(value="couverture", required = false) MultipartFile couverture,
                                                @RequestParam(value="images", required = false) MultipartFile[] images ) {
            Espace espace = convertToEntity(espaceDto);
            ;
        return ResponseEntity.ok(convertToDto(espaceService.update(id,espace,couverture,images)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEspace(@PathVariable Long id) {
        espaceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Update an article
    @PutMapping(value = "/disable/{id}")
    public ResponseEntity<EspaceDto> disable(@PathVariable Long id)  {
        EspaceDto updateEspace = espaceService.disable(id);
        return ResponseEntity.ok(updateEspace);
    }

    // Convertir `Espace` en `EspaceDto`
    private EspaceDto convertToDto(Espace espace) {
        EspaceDto dto = new EspaceDto();
        dto.setId(espace.getId());
        dto.setNom(espace.getNom());
        dto.setType(espace.getType());
        dto.setDescription(espace.getDescription());
        dto.setTarif(espace.getTarif());
        dto.setStatut(espace.getStatut());
        dto.setImg(espace.getImg());
        
        // List<UploadDto> uploadDtos = espace.getPaths().stream()
        //         .map(upload -> {
        //             UploadDto uploadDto = new UploadDto();
        //             uploadDto.setId(upload.getId());
        //             uploadDto.setPath(upload.getPath());
        //             uploadDto.setDoc(upload.getDoc());
        //             uploadDto.setAppuiTechniqueId(upload.getAppuiTechnique() != null ? upload.getAppuiTechnique().getId() : null);
        //             return uploadDto;
        //         })
        //         .collect(Collectors.toList());
        // dto.setPaths(uploadDtos);
        
        return dto;
    }

    // Convertir `EspaceDto` en `Espace`
    private Espace convertToEntity(EspaceDto espaceDto) {
        Espace espace = new Espace();
        espace.setNom(espaceDto.getNom());
        espace.setType(espaceDto.getType());
        espace.setDescription(espaceDto.getDescription());
        espace.setTarif(espaceDto.getTarif());
        espace.setStatut(espaceDto.getStatut());
        espace.setImg(espaceDto.getImg());
        espace.setStatut(espaceDto.getStatut());

        // List<Upload> uploads = espaceDto.getPaths().stream()
        //         .map(dto -> {
        //             Upload upload = new Upload();
        //             upload.setPath(dto.getPath());                   
        //             upload.setEspace(espace);  // Associe l'upload à l'espace courant
        //             return upload;
        //         })
        //         .collect(Collectors.toList());
        // espace.setPaths(uploads);
        
        return espace;
    }
}
