package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Atiko.entities.Espace;

@Repository
public interface EspaceRepository extends JpaRepository<Espace, Long> {
    // Méthodes de requête personnalisées si nécessaire
}