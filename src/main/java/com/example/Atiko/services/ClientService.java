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
import java.util.Set;

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


public ClientDto updateClient(ClientDto clientDto) {
    User user = userRepository.findById(clientDto.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id " + clientDto.getId()));

    // Vérifier si l'email est changé et déjà pris
    if (!user.getEmail().equals(clientDto.getEmail()) &&
        userRepository.existsByEmail(clientDto.getEmail())) {
        throw new RuntimeException("Cet email est déjà utilisé. UPDATE");
    }

    user.setUsername(clientDto.getEmail());
    user.setEmail(clientDto.getEmail());
    user.setStatus(clientDto.getStatus() != null ? clientDto.getStatus() : user.getStatus());

    UserProfile profile = profileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Profil introuvable pour l'utilisateur " + clientDto.getId()));

    fillProfileFromDto(profile, clientDto);

    userRepository.save(user);
    profileRepository.save(profile);

    return buildClientDto(user, profile);
}

public ClientDto createClient(ClientDto clientDto) {
    if (userRepository.existsByEmail(clientDto.getEmail())) {
        throw new RuntimeException("Cet email est déjà utilisé. NEW");
    }

    User user = new User();
    user.setUsername(clientDto.getEmail());
    user.setEmail(clientDto.getEmail());
    user.setStatus(true);
    user.setCreatedAt(LocalDateTime.now());
    user.setPassword(encoder.encode("password"));

    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Le rôle USER n'existe pas en base."));
    user.setRoles(Set.of(userRole));

    user = userRepository.save(user);

    UserProfile profile = new UserProfile();
    fillProfileFromDto(profile, clientDto);
    profile.setUser(user);

    profileRepository.save(profile);

    return buildClientDto(user, profile);
}

/** Méthode utilitaire pour remplir le profil à partir du DTO */
private void fillProfileFromDto(UserProfile profile, ClientDto clientDto) {
    profile.setNom(clientDto.getNomComplet());
    profile.setTelephone(clientDto.getTelephone());
    profile.setAdresse(clientDto.getAdresse());
    profile.setLocalisation(clientDto.getLocalisation());
    profile.setFonction(clientDto.getFonction());
    profile.setTypePieceIdentite(clientDto.getTypePieceIdentite());
    profile.setNumeroPieceIdentite(clientDto.getNumeroPieceIdentite());
    profile.setNumeroPermisConduire(clientDto.getNumeroPermisConduire());
    profile.setPaysDelivrancePermis(clientDto.getPaysDelivrancePermis());
    profile.setDateDelivrancePermis(clientDto.getDateDelivrancePermis());
    profile.setDateExpirationPermis(clientDto.getDateExpirationPermis());
}

/** Méthode utilitaire pour construire le ClientDto de retour */
private ClientDto buildClientDto(User user, UserProfile profile) {
    ClientDto result = new ClientDto();
    result.setId(user.getId());
    result.setUsername(user.getUsername());
    result.setEmail(user.getEmail());
    result.setNomComplet(profile.getNom());
    result.setAdresse(profile.getAdresse());
    result.setTelephone(profile.getTelephone());
    result.setLocalisation(profile.getLocalisation());
    result.setFonction(profile.getFonction());
    result.setTypePieceIdentite(profile.getTypePieceIdentite());
    result.setNumeroPieceIdentite(profile.getNumeroPieceIdentite());
    result.setNumeroPermisConduire(profile.getNumeroPermisConduire());
    result.setPaysDelivrancePermis(profile.getPaysDelivrancePermis());
    result.setDateDelivrancePermis(profile.getDateDelivrancePermis());
    result.setDateExpirationPermis(profile.getDateExpirationPermis());
    result.setStatus(user.getStatus());
    result.setCreatedAt(user.getCreatedAt() != null ?
            user.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : null);
    return result;
}
  

}
