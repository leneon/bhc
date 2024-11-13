package com.example.Atiko.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Atiko.entities.AppuiTechnique;
import com.example.Atiko.repositories.AppuiTechniqueRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AppuiTechniqueService {

    private final AppuiTechniqueRepository appuiTechniqueRepository;

    @Autowired
    public AppuiTechniqueService(AppuiTechniqueRepository appuiTechniqueRepository) {
        this.appuiTechniqueRepository = appuiTechniqueRepository;
    }

    public List<AppuiTechnique> getAllAppuiTechniques() {
        return appuiTechniqueRepository.findAll();
    }

    public Optional<AppuiTechnique> getAppuiTechniqueById(Long id) {
        return appuiTechniqueRepository.findById(id);
    }

    public AppuiTechnique saveAppuiTechnique(AppuiTechnique appuiTechnique) {
        return appuiTechniqueRepository.save(appuiTechnique);
    }

    public void deleteAppuiTechnique(Long id) {
        appuiTechniqueRepository.deleteById(id);
    }
}
