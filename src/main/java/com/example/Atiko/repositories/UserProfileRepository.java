package com.example.Atiko.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
        Optional<UserProfile> findByUserId(Long userId);

}
