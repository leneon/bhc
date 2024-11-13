package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.dtos.CategorieDto;
import com.example.Atiko.services.CategorieService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieResource {

    @Autowired
    private CategorieService categorieService;

    @GetMapping
    public List<CategorieDto> getAllCategories() {
        return categorieService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieDto> getCategorieById(@PathVariable Long id) {
        return categorieService.getCategorieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategorieDto> createCategorie(@RequestBody CategorieDto categorieDto) {
        CategorieDto createdCategorie = categorieService.createCategorie(categorieDto);
        return ResponseEntity.ok(createdCategorie);
    }

    @PutMapping("/disable/{id}")
    public ResponseEntity<CategorieDto> disableCategorie(@PathVariable Long id) {
        return categorieService.disableCategorie(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CategorieDto> updateCategorie(@PathVariable Long id, @RequestBody CategorieDto categorieDto) {
        return categorieService.updateCategorie(id, categorieDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }
}
