package com.example.Atiko.services;

import com.example.Atiko.entities.Marque;
import com.example.Atiko.repositories.MarqueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarqueService {
    private final MarqueRepository marqueRepository;

    public MarqueService(MarqueRepository marqueRepository) {
        this.marqueRepository = marqueRepository;
    }

    public Marque save(Marque marque) {
        return marqueRepository.save(marque);
    }

    public List<Marque> findAll() {
        return marqueRepository.findAll();
    }

    public Marque findById(Long id) {
        return marqueRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        marqueRepository.deleteById(id);
    }
}
