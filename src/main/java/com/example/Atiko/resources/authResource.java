package com.example.Atiko.resources;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.example.Atiko.dtos.UserDto;
import com.example.Atiko.security.services.UserDetailsImpl;

 @RestController("/api")
public class authResource {
    @GetMapping("/user")
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            return new UserDto(userDetails, role);
        } else {
            return null;
        }
    }

}
