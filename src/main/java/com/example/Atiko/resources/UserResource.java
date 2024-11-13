package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.ProfileDto;
import com.example.Atiko.dtos.UserDto;
import com.example.Atiko.security.services.UserDetailsImpl;
import com.example.Atiko.security.services.UserDetailsServiceImpl;
import com.example.Atiko.services.ProfileService;

import java.io.IOException;
import java.util.List;


@RequestMapping(path = "/api/users")
@RestController
public class UserResource {
    @Autowired
    private ProfileService profileService;
    @Autowired
        private UserDetailsServiceImpl userService;

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<ProfileDto> getUserById(@PathVariable Long id) {
        ProfileDto profile = profileService.getProfileById(id);
        if (profile == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        return ResponseEntity.ok(profile); // 200 OK
    }
    
    // Récupérer tous les utilisateurs
    @GetMapping
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
  public UserDto updateUser(@RequestBody UserDto userDto) {
      return userService.updateUser(userDto);
  }
  // Méthode pour obtenir un profil par ID
  @GetMapping("/details/{id}")
  public ResponseEntity<ProfileDto> getProfileById(@PathVariable Long id) {
      ProfileDto profile = profileService.getProfileByUserId(id);
      if (profile == null) {
          return ResponseEntity.notFound().build(); // 404 Not Found
      }
        return ResponseEntity.ok(profile); // 200 OK
    }


    // Méthode pour mettre à jour un profil existant
    @PutMapping(value="/profile/{id}", consumes ={ MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ProfileDto> updateProfile(@PathVariable Long id, 
                                                    @RequestPart("profileDto") ProfileDto profileDto, 
                                                    @RequestPart(value = "avatar", required = false) MultipartFile avatar) throws IOException {
        ProfileDto updatedProfile = profileService.updateProfile(id, profileDto, avatar);
        if (updatedProfile == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
        return ResponseEntity.ok(updatedProfile); // 200 OK
    }

    
}
