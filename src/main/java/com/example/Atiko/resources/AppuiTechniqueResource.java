package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.entities.AppuiTechnique;
import com.example.Atiko.services.AppuiTechniqueService;

import java.util.List;

@RestController
@RequestMapping("/api/appui-techniques")
public class AppuiTechniqueResource {

    private final AppuiTechniqueService appuiTechniqueService;

    @Autowired
    public AppuiTechniqueResource(AppuiTechniqueService appuiTechniqueService) {
        this.appuiTechniqueService = appuiTechniqueService;
    }

    @GetMapping
    public ResponseEntity<List<AppuiTechnique>> getAllAppuiTechniques() {
        List<AppuiTechnique> appuiTechniques = appuiTechniqueService.getAllAppuiTechniques();
        return new ResponseEntity<>(appuiTechniques, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppuiTechnique> getAppuiTechniqueById(@PathVariable Long id) {
        return appuiTechniqueService.getAppuiTechniqueById(id)
            .map(appui -> new ResponseEntity<>(appui, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AppuiTechnique> createAppuiTechnique(@RequestBody AppuiTechnique appuiTechnique) {
        AppuiTechnique savedAppuiTechnique = appuiTechniqueService.saveAppuiTechnique(appuiTechnique);
        return new ResponseEntity<>(savedAppuiTechnique, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppuiTechnique> updateAppuiTechnique(@PathVariable Long id, @RequestBody AppuiTechnique appuiTechnique) {
        if (!appuiTechniqueService.getAppuiTechniqueById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        appuiTechnique.setId(id);
        AppuiTechnique updatedAppuiTechnique = appuiTechniqueService.saveAppuiTechnique(appuiTechnique);
        return new ResponseEntity<>(updatedAppuiTechnique, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppuiTechnique(@PathVariable Long id) {
        if (!appuiTechniqueService.getAppuiTechniqueById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        appuiTechniqueService.deleteAppuiTechnique(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
