package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.Atiko.entities.AppuiTechnique;

@Repository
public interface AppuiTechniqueRepository extends JpaRepository<AppuiTechnique, Long> {
}
