package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.Atiko.entities.Upload;

@Repository
public interface UploadRepository extends JpaRepository<Upload, Long> {
    // Ajoutez des méthodes de requête personnalisées ici si nécessaire
}