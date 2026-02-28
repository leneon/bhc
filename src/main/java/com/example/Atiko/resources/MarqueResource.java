package com.example.Atiko.resources;

import com.example.Atiko.entities.Marque;
import com.example.Atiko.services.MarqueService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marques")
public class MarqueResource {
    private final MarqueService marqueService;

    public MarqueResource(MarqueService marqueService) {
        this.marqueService = marqueService;
    }

    @PostMapping
    public Marque create(@RequestBody Marque marque) {
        return marqueService.save(marque);
    }

    @GetMapping
    public List<Marque> getAll() {
        return marqueService.findAll();
    }

    @GetMapping("/{id}")
    public Marque getById(@PathVariable Long id) {
        return marqueService.findById(id);
    }

    @PutMapping("/{id}")
    public Marque update(@PathVariable Long id, @RequestBody Marque marque) {
        Marque existing = marqueService.findById(id);
        if (existing == null) return null;
        existing.setNom(marque.getNom());
        existing.setDescription(marque.getDescription());
        existing.setStatut(marque.getStatut());
        return marqueService.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        marqueService.delete(id);
    }
}
