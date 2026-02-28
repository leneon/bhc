package com.example.Atiko.repositories;

import com.example.Atiko.entities.Assurance;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssuranceRepository extends JpaRepository<Assurance, Long> {

    boolean existsByNumeroPolice(String numeroPolice);

    List<Assurance> findByVoitureId(Long voitureId);
}
