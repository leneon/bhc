package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    
}
