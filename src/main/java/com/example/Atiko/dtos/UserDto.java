package com.example.Atiko.dtos;


import java.time.LocalDateTime;

import com.example.Atiko.entities.User;
import com.example.Atiko.security.services.UserDetailsImpl;

public class UserDto {
    private Long id;
    
    private String email;

    private String username;
    
    private String role;

    private LocalDateTime createdAt;

    private Boolean status;

    private String password;
    


    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Boolean getStatus() {
        return status;
    }
    public void setStatus(Boolean status) {
        this.status = status;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public UserDto() {
    }
    public UserDto(UserDetailsImpl user,String role) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = role;
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getFirstRoleAsString();
        this.createdAt = user.getCreatedAt();
        this.status = user.getStatus();
    }
    public UserDto(Long id) {
        this.id  = id;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    
    }
    public String getEmail() {
        return this.email;
    }
    public void setEmail(String email) {
         this.email = email;
    }
    @Override
    public String toString() {
        return "UserDto [id=" + id + ", email=" + email + ", username=" + username + ", role=" + role + ", createdAt="
                + createdAt + ", status=" + status + ", password=" + password + "]";
    }





    
    
    
}
