package com.example.Atiko.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String defaultUploadDir = "./uploads"; // répertoire par défaut

    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return null;
        }
        String[] parts = fileName.split("\\.");
        return parts[parts.length - 1];
    }

    public String storeFile(MultipartFile file, String path) {
        // Définit le répertoire cible
        Path uploadPath = Paths.get(defaultUploadDir, path).toAbsolutePath().normalize();

        try {
            Files.createDirectories(uploadPath); // créer le dossier s’il n’existe pas
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le répertoire : " + uploadPath, e);
        }

        // Générer un nom de fichier unique
        String fileName = new Date().getTime() + "-file." + getFileExtension(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Nom de fichier invalide : " + fileName);
            }

            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retourne le chemin relatif pour stockage en base
            return "uploads/" + path + "/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Impossible de stocker le fichier " + fileName + ". Réessayez !", ex);
        }
    }
}
