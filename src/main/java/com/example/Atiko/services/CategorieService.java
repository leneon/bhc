package com.example.Atiko.services;

import com.example.Atiko.dtos.CategorieDto;
import com.example.Atiko.entities.Categorie;
import com.example.Atiko.repositories.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    // Convert Categorie to CategorieDto
    private CategorieDto convertToDto(Categorie categorie) {
        return new CategorieDto(categorie);
    }

    // Convert CategorieDto to Categorie
    private Categorie convertToEntity(CategorieDto dto) {
        Categorie categorie = new Categorie();
        categorie.setId(dto.getId());
        categorie.setNom(dto.getNom());
        categorie.setStatut(dto.getStatut());
        return categorie;
    }

    public List<CategorieDto> getAllCategories() {
        return categorieRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CategorieDto> getCategorieById(Long id) {
        return categorieRepository.findById(id).map(this::convertToDto);
    }

    public CategorieDto createCategorie(CategorieDto categorieDto) {
        Categorie categorie = new Categorie();
        categorie.setId(categorieDto.getId());
        categorie.setNom(categorieDto.getNom());
        categorie.setStatut(true);        
        Categorie savedCategorie = categorieRepository.save(categorie);
        return convertToDto(savedCategorie);
    }

    public Optional<CategorieDto> updateCategorie(Long id, CategorieDto categorieDto) {
        return categorieRepository.findById(id).map(existingCategorie -> {
            existingCategorie.setNom(categorieDto.getNom());
            existingCategorie.setStatut(categorieDto.getStatut());
            return convertToDto(categorieRepository.save(existingCategorie));
        });
    }
    public Optional<CategorieDto> disableCategorie(Long id) {
        return categorieRepository.findById(id).map(existingCategorie -> {
            existingCategorie.setStatut(!existingCategorie.getStatut());
            return convertToDto(categorieRepository.save(existingCategorie));
        });
    }

    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }
}
