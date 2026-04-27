package com.example.Atiko.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Atiko.dtos.UserDto;
import com.example.Atiko.entities.ERole;
import com.example.Atiko.entities.Role;
import com.example.Atiko.entities.User;
import com.example.Atiko.repositories.RoleRepository;
import com.example.Atiko.repositories.UserRepository;
import com.example.Atiko.repositories.UserProfileRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;
  
  @Autowired
  UserProfileRepository profileRepository;
  
  @Autowired
  private PasswordEncoder encoder;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

    return UserDetailsImpl.build(user);
  }

  public List<UserDto> getAllUser() {
      return userRepository.findAll().stream()
              .map(this::convertToDto)
              .collect(Collectors.toList());
  }

    private UserDto convertToDto(User user) {
        return new UserDto(user);
    }
    
    public UserDto updateUser(UserDto userDto) {
        System.out.println("UPDATE USER - Received data: " + userDto.toString());
        Optional<User> optionalUser = userRepository.findById(userDto.getId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Update email
            user.setEmail(userDto.getEmail());
            user.setUsername(userDto.getUsername());
            user.setStatus(userDto.getStatus());
            
            // Update password only if a new password is provided
            if (userDto.getPassword() != null) {
                user.setPassword(encoder.encode(userDto.getPassword()));
            }
    
            // Convert the received role to `ERole` and fetch the Role entity
            ERole eRole = ERole.valueOf(userDto.getRole()); // userDto.getRole() should match one of the names in `ERole`
            System.out.println("Erole : "+eRole);
            Role role = roleRepository.findByName(eRole)
                .orElseThrow(() -> new RuntimeException("Role not found"));

            System.out.println("Erole : "+role.toString());
    
            // Update the user's roles by clearing existing roles and adding the new one
            user.getRoles().clear();      // Clear all existing roles
            user.getRoles().add(role);    // Add the new role
            userRepository.save(user);

            System.out.println("USER UPDATED: "+user.toString());

            return new UserDto(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public boolean deleteUser(Long userId) {
        System.out.println("DELETE USER - User ID: " + userId);
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            System.out.println("Found user: " + user.getUsername());
            
            // Supprimer d'abord le profil associé s'il existe
            if (user.getProfile() != null) {
                System.out.println("Deleting associated profile");
                profileRepository.delete(user.getProfile());
            }
            
            // Supprimer les relations de rôles
            user.getRoles().clear();
            userRepository.save(user);
            
            // Maintenant supprimer l'utilisateur
            userRepository.delete(user);
            System.out.println("User deleted successfully");
            return true;
        }
        System.out.println("User not found for deletion");
        return false;
    }
    
}
