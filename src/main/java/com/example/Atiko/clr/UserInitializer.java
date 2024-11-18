// package com.example.Atiko.clr;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;
// import org.springframework.http.ResponseEntity;
// import org.springframework.beans.factory.annotation.Autowired;

// import com.example.Atiko.entities.ERole;
// import com.example.Atiko.entities.Profile;
// import com.example.Atiko.entities.Role;
// import com.example.Atiko.entities.User;
// import com.example.Atiko.payload.request.SignupRequest;
// import com.example.Atiko.payload.response.MessageResponse;
// import com.example.Atiko.repositories.ProfileRepository;
// import com.example.Atiko.repositories.RoleRepository;
// import com.example.Atiko.repositories.UserRepository;

// import java.util.HashSet;
// import java.util.Set;

// @Component
// public class UserInitializer implements CommandLineRunner {

//     private final UserRepository userRepository;
//     private final RoleRepository roleRepository;
//     private final PasswordEncoder passwordEncoder;
//     private final ProfileRepository profileRepository;

//     @Autowired
//     public UserInitializer(ProfileRepository profileRepository, UserRepository userRepository, 
//                            RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
//         this.profileRepository = profileRepository;
//         this.userRepository = userRepository;
//         this.roleRepository = roleRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     @Override
//     public void run(String... args) throws Exception {
//         initializeRolesAndUsers();
//     }

//     private void initializeRolesAndUsers() {
//         for (ERole roleEnum : ERole.values()) {
//             // Créer ou récupérer le rôle
//             Role role = roleRepository.findByName(roleEnum).orElseGet(() -> createRole(roleEnum));

//             // Créer un utilisateur par défaut pour chaque rôle
//             String username = roleEnum.name().toLowerCase().replace("role_", "");
//             createDefaultUserForRole(username, role);
//         }
//     }

//     private Role createRole(ERole roleEnum) {
//         Role role = new Role();
//         role.setName(roleEnum);
//         roleRepository.save(role);
//         System.out.println("Rôle '" + roleEnum + "' créé.");
//         return role;
//     }

//     private void createDefaultUserForRole(String username, Role role) {
//         if (userRepository.findByUsername(username).isEmpty()) {
//             User user = new User();
//             Set<Role> roles = new HashSet<>();
//             user.setUsername(username);
//             user.setEmail(username + "@bhc.com");
//             user.setPassword(passwordEncoder.encode("Rootkit1010."));
//             user.setStatus(true);
//             roles.add(role);
//             user.setRoles(roles);

//             userRepository.save(user);

//             // Créer un profil pour l'utilisateur
//             createProfileForUser(user);

//             System.out.println("Utilisateur '" + username + "' avec le rôle '" + role.getName() + "' créé.");
//         } else {
//             System.out.println("Utilisateur '" + username + "' existe déjà.");
//         }
//     }

//     private void createProfileForUser(User user) {
//         Profile profile = new Profile();
//         profile.setUser(user);
//         // Ajouter d'autres champs si nécessaires (ex. : nom, prénom, avatar, etc.)
//         profileRepository.save(profile);
//         System.out.println("Profil pour l'utilisateur '" + user.getUsername() + "' créé.");
//     }

//     // Méthode de création d'utilisateur via le service de création
//     public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {
//         // Vérifiez si le nom d'utilisateur existe déjà
//         if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//             return ResponseEntity.badRequest().body(new MessageResponse("Erreur: Le nom d'utilisateur est déjà pris !"));
//         }

//         // Vérifiez si l'email existe déjà
//         if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//             return ResponseEntity.badRequest().body(new MessageResponse("Erreur: Email est déjà pris !"));
//         }

//         // Créer un nouvel utilisateur
//         User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), passwordEncoder.encode(signUpRequest.getPassword()));

//         // Gérer les rôles
//         Set<String> strRoles = signUpRequest.getRole();
//         Set<Role> roles = new HashSet<>();
        
//         if (strRoles == null) {
//             Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//                     .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
//             roles.add(userRole);
//         } else {
//             strRoles.forEach(role -> {
//                 switch (role) {
//                     case "SUPER_ADMIN":
//                         Role superAdminRole = roleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
//                                 .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
//                         roles.add(superAdminRole);
//                         break;
//                     case "ADMIN":
//                         Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
//                                 .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
//                         roles.add(adminRole);
//                         break;
//                     case "MODERATOR":
//                         Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
//                                 .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
//                         roles.add(modRole);
//                         break;
//                     default:
//                         Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//                                 .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
//                         roles.add(userRole);
//                 }
//             });
//         }

//         user.setRoles(roles);
//         user.setStatus(true);
//         userRepository.save(user);

//         // Créer le profil après l'enregistrement de l'utilisateur
//         Profile profile = new Profile();
//         profile.setUser(user); // L'utilisateur nouvellement créé
//         // Vous pouvez définir d'autres attributs ici si nécessaire

//         // Sauvegarder le profil
//         profileRepository.save(profile); // Assurez-vous d'avoir le profileRepository injecté

//         return ResponseEntity.ok(new MessageResponse("Utilisateur enregistré avec succès et profil créé !"));
//     }
// }
