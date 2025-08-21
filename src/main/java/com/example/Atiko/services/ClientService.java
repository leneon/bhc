package com.example.Atiko.services;

import com.example.Atiko.entities.User;
import com.example.Atiko.entities.UserProfile;
import com.example.Atiko.entities.Role;
import com.example.Atiko.dtos.ClientDto;
import com.example.Atiko.entities.ERole;
import com.example.Atiko.repositories.UserRepository;
import com.example.Atiko.repositories.UserProfileRepository;
import com.example.Atiko.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service

public class ClientService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProfileRepository profileRepository;
    @Autowired
    private RoleRepository roleRepository;

    private final PasswordEncoder encoder;

      public ClientService(PasswordEncoder encoder) {
      this.encoder = encoder;
  }

    public ClientDto saveClient(ClientDto clientDto) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(clientDto.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }
        // Création de l'utilisateur
        User user = new User();
        user.setUsername(clientDto.getEmail()); // username = email
        user.setEmail(clientDto.getEmail());
        user.setStatus(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(encoder.encode("password")); // mot de passe par défaut

        // Récupérer le rôle existant en base
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Le rôle USER n'existe pas en base."));
        user.getRoles().clear();
        user.getRoles().add(userRole);

        user = userRepository.save(user);

        // Création du profil
        UserProfile profile = new UserProfile();
        profile.setNom(clientDto.getNomComplet());
        profile.setTelephone(clientDto.getTelephone());
        profile.setAdresse(clientDto.getAdresse()); // adresse = localisation
        profile.setUser(user);
        profileRepository.save(profile);

        // Préparer le DTO de retour
        ClientDto result = new ClientDto();
        result.setId(user.getId());
        result.setUsername(user.getUsername());
        result.setEmail(user.getEmail());
        result.setNomComplet(profile.getNom());
        result.setAdresse(profile.getAdresse());
        result.setTelephone(profile.getTelephone());
        result.setStatus(user.getStatus());
        result.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : null);
        return result;
    }
}
