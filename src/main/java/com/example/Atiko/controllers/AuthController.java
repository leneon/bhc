package com.example.Atiko.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Atiko.entities.ERole;
import com.example.Atiko.entities.Profile;
import com.example.Atiko.entities.Role;
import com.example.Atiko.entities.User;
import com.example.Atiko.payload.request.LoginRequest;
import com.example.Atiko.payload.request.SignupRequest;
import com.example.Atiko.payload.response.JwtResponse;
import com.example.Atiko.payload.response.MessageResponse;
import com.example.Atiko.repositories.ProfileRepository;
import com.example.Atiko.repositories.RoleRepository;
import com.example.Atiko.repositories.UserRepository;
import com.example.Atiko.security.jwt.JwtUtils;
import com.example.Atiko.security.services.UserDetailsImpl;
import com.example.Atiko.services.PasswordResetService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  ProfileRepository profileRepository;


  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;
  
  @Autowired
  private PasswordResetService passwordResetService;


  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

@PostMapping("/signup")
public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    // Vérifiez si le nom d'utilisateur existe déjà
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
        return ResponseEntity.badRequest().body(new MessageResponse("Erreur: Le nom d'utilisateur est déjà pris !"));
    }

    // Vérifiez si l'email existe déjà
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
        return ResponseEntity.badRequest().body(new MessageResponse("Erreur: Email est déjà pris !"));
    }

    // Créer un nouvel utilisateur
    User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));

    // Gérer les rôles
    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();
    
    if (strRoles == null) {
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
        roles.add(userRole);
    } else {
        strRoles.forEach(role -> {
            switch (role) {
                case "SUPER_ADMIN":
                    Role superAdminRole = roleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
                    roles.add(superAdminRole);
                    break;
                case "ADMIN":
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
                    roles.add(adminRole);
                    break;
                case "MODERATOR":
                    Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
                    roles.add(modRole);
                    break;
                default:
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
                    roles.add(userRole);
            }
        });
    }

    user.setRoles(roles);
    user.setStatus(true);
    userRepository.save(user);

    // Créer le profil après l'enregistrement de l'utilisateur
    Profile profile = new Profile();
    profile.setUser(user); // L'utilisateur nouvellement créé
    // Vous pouvez définir d'autres attributs ici si nécessaire

    // Sauvegarder le profil
    profileRepository.save(profile); // Assurez-vous d'avoir le profileRepository injecté

    return ResponseEntity.ok(new MessageResponse("Utilisateur enregistré avec succès et profil créé !"));
}


    // Endpoint pour initier la réinitialisation
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        passwordResetService.initiatePasswordReset(email);
        return ResponseEntity.ok("Un lien de réinitialisation a été envoyé à votre email.");
    }

    // Endpoint pour réinitialiser le mot de passe
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Votre mot de passe a été réinitialisé avec succès.");
    }
}
