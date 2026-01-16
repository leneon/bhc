package com.example.Atiko.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.VisiteTechnique;

public interface VisiteTechniqueRepository extends JpaRepository<VisiteTechnique, Long> {

    List<VisiteTechnique> findByVoitureIdOrderByDateFinDesc(Long voitureId);

}
