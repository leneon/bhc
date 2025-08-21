package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Atiko.entities.Voiture;

@Repository
public interface VoitureRepository extends JpaRepository<Voiture, Long> {
    
} 