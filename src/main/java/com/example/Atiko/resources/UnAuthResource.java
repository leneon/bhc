package com.example.Atiko.resources;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Atiko.dtos.*;
import com.example.Atiko.entities.Contact;
import com.example.Atiko.entities.Espace;
import com.example.Atiko.services.*;

import jakarta.websocket.server.PathParam;

@RequestMapping("/unauth")
@RestController
public class UnAuthResource {
    
    @Autowired
    private StructureService structureService;
    @Autowired
    private ArticleService articleService;
    @Autowired
    private CategorieService categorieService;
    @Autowired
    private NewsletterService newsletterService;
    @Autowired
    private CommentaireService commentaireService;    
    @Autowired
    private EspaceService espaceService;
    @Autowired
    private ServiceService serviceService;
    @Autowired
    private ContactService contactService;



    @GetMapping("/structure")
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
    
    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDto>> getAllArticlesWithComments() {
        List<ArticleDto> aricles = articleService.getAllArticlesWithCommentCount();
        if (aricles.isEmpty()) {
            return ResponseEntity.noContent().build();  // 204 No Content si aucune structure n'existe
        }
        return ResponseEntity.ok(aricles);  // 200 OK avec la première structure
    }
    @GetMapping("/articles/{id}")
    public ResponseEntity<ArticleDto> getArticle(@PathVariable Long id) {
        ArticleDto aricle = articleService.getArticleById(id);
        if (aricle==null) {
            return ResponseEntity.noContent().build();  // 204 No Content si aucune structure n'existe
        }
        return ResponseEntity.ok(aricle);  // 200 OK avec la première structure
    }
    @PutMapping("/like/{id}")
    public ResponseEntity<ArticleDto> like(@PathVariable Long id) {
       return ResponseEntity.ok(articleService.like(id));
    }
    @PutMapping("/dislike/{id}")
    public ResponseEntity<ArticleDto> dislike(@PathVariable Long id) {
       return ResponseEntity.ok(articleService.like(id));
    }
    @GetMapping("/categories")
    public ResponseEntity<List<CategorieDto>> getAllCategories() {
        List<CategorieDto> cats = categorieService.getAllCategories();
        if (cats.isEmpty()) {
            return ResponseEntity.noContent().build();  // 204 No Content si aucune structure n'existe
        }
        return ResponseEntity.ok(cats);  // 200 OK avec la première structure
    }

    @PostMapping("/newsletter")
    public ResponseEntity<NewsletterDto> newsletter(@RequestBody NewsletterDto dto) {
        return ResponseEntity.ok(newsletterService.createNewsletter(dto));  // 200 OK avec la première structure
    }

    
    @PostMapping("/contact")
    public ResponseEntity<Contact> contact(@RequestBody ContactDTO dto) {
        return ResponseEntity.ok(contactService.createContact(dto));  // 200 OK avec la première structure
    }
 
    @PostMapping("/commentaire")
    public ResponseEntity<CommentaireDto> postComment(@RequestBody CommentaireDto dto) {
        CommentaireDto comment = commentaireService.saveCommentaire(dto);
        if (comment==null) {
            return ResponseEntity.noContent().build();  // 204 No Content si aucune structure n'existe
        }
        return ResponseEntity.ok(comment);  // 200 OK avec la première structure
    }

   @GetMapping("/services")
    public ResponseEntity<List<ServiceDto>> getAllservices() {
        List<ServiceDto> services = serviceService.getAllservices();
        return ResponseEntity.ok(services);
    }
    @GetMapping("/services/{id}")
    public ResponseEntity<Optional<ServiceDto>> getService(@PathVariable Long id) {
        Optional<ServiceDto> service = serviceService.getServiceById(id);
            if (service==null) {
                return ResponseEntity.noContent().build();  // 204 No Content si aucune structure n'existe
            }
        return ResponseEntity.ok(service);
    }
  
    @GetMapping("/espaces")
    public ResponseEntity<List<EspaceDto>> getAllEspaces() {
        List<EspaceDto> espaces =  espaceService.findAll().stream()
                                                .map(this::convertToDto)
                                                .collect(Collectors.toList());;
                                        
        return ResponseEntity.ok(espaces);
    }
    @GetMapping("/espaces/{id}")
    public ResponseEntity<List<EspaceDto>> getEspace(Long id) {
        List<EspaceDto> espaces =  espaceService.findAll().stream()
                                                .map(this::convertToDto)
                                                .collect(Collectors.toList());;
                                        
        return ResponseEntity.ok(espaces);
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
        return dto;
    }

}
