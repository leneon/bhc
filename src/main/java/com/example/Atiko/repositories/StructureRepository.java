package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.Atiko.entities.Structure;
@Repository
public interface StructureRepository extends JpaRepository<Structure, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici si nécessaire
}
