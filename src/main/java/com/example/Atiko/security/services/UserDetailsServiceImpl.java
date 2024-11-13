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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;
  
  private final PasswordEncoder encoder;

  public UserDetailsServiceImpl(PasswordEncoder encoder) {
      this.encoder = encoder;
  }

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
        Optional<User> optionalUser = userRepository.findById(userDto.getId());
        System.out.println(userDto);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Update email
            user.setEmail(userDto.getEmail());
            
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

            System.out.println("USER : "+user.toString());

            return new UserDto(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }
    
}
