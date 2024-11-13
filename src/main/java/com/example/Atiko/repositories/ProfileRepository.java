package com.example.Atiko.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
        Optional<Profile> findByUserId(Long userId);

}
