


package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.services.ClientService;

import com.example.Atiko.dtos.UserProfileDto;
import com.example.Atiko.dtos.ClientDto;
import com.example.Atiko.dtos.UserDto;
import com.example.Atiko.security.services.UserDetailsImpl;
import com.example.Atiko.security.services.UserDetailsServiceImpl;
import com.example.Atiko.services.UserProfileService;

import java.io.IOException;
import java.util.List;


@RequestMapping(path = "/api/users")
@RestController
public class UserResource {
    @Autowired
    private UserProfileService userProfileService;
    @Autowired
        private UserDetailsServiceImpl userService;
    @Autowired
    private ClientService clientService;
    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        UserProfileDto profile = userProfileService.getProfileById(id);
        if (profile == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        return ResponseEntity.ok(profile); // 200 OK
    }
    
    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers() {
        List<UserDto> users = userService.getAllUser();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si aucun profil trouvé
        }
        return ResponseEntity.ok(users); // 200 OK avec la liste des profils
    }

     @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUser();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si aucun profil trouvé
        }
        return ResponseEntity.ok(users); // 200 OK avec la liste des profils
    }
        
    @GetMapping("/auth")
    public ResponseEntity<?> user() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDto user = null;  // Initialize the user variable
    if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        user = new UserDto(userDetails, role);  // Only populate user if authenticated
    }
    return ResponseEntity.ok(user);
  }

  @PutMapping("/update")
  public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto) {
      try {
          UserDto updatedUser = userService.updateUser(userDto);
          return ResponseEntity.ok(updatedUser);
      } catch (Exception e) {
          return ResponseEntity.badRequest().build();
      }
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<String> deleteUser(@PathVariable Long id) {
      try {
          boolean deleted = userService.deleteUser(id);
          if (deleted) {
              return ResponseEntity.ok("Utilisateur supprimé avec succès");
          } else {
              return ResponseEntity.notFound().build();
          }
      } catch (Exception e) {
          return ResponseEntity.badRequest().body("Erreur lors de la suppression");
      }
  }
  // Méthode pour obtenir un profil par ID
  @GetMapping("/details/{id}")
  public ResponseEntity<UserProfileDto> getProfileById(@PathVariable Long id) {
      UserProfileDto profile = userProfileService.getProfileByUserId(id);
      if (profile == null) {
          return ResponseEntity.notFound().build(); // 404 Not Found
      }
        return ResponseEntity.ok(profile); // 200 OK
    }


    // Méthode pour mettre à jour un profil existant
    @PutMapping(value="/profile/{id}", consumes ={ MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<UserProfileDto> updateProfile(@PathVariable Long id, 
                                                    @RequestPart("profileDto") UserProfileDto profileDto, 
                                                    @RequestPart(value = "avatar", required = false) MultipartFile avatar) throws IOException {
        UserProfileDto updatedProfile = userProfileService.updateProfile(id, profileDto, avatar);
        if (updatedProfile == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        return ResponseEntity.ok(updatedProfile); // 200 OK
    }

        // Récupérer tous les clients (utilisateurs avec le rôle ROLE_USER)
    @GetMapping("/clients")
    public ResponseEntity<List<UserDto>> getAllClients() {
        List<UserDto> users = userService.getAllUser();
        List<UserDto> clients = users.stream()
            .filter(u -> u.getRole() != null && u.getRole().equals("ROLE_USER"))
            .toList();
        if (clients.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clients);
    }
    // Création d'un client
    @PostMapping("/clients")
    public ResponseEntity<?> createClient(@RequestBody ClientDto clientDto) {
        try {
            ClientDto created = clientService.saveClient(clientDto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            // Erreur métier (ex: email déjà utilisé)
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // Erreur technique
            return ResponseEntity.status(500).body(new ErrorResponse("Erreur technique lors de la création du client."));
        }
    }

    // Classe de réponse d'erreur simple
    public static class ErrorResponse {
        public String message;
        public ErrorResponse(String message) { this.message = message; }
    }


    
}
