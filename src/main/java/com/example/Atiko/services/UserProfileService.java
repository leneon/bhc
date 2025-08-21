package com.example.Atiko.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.UserDto;
import com.example.Atiko.dtos.UserProfileDto;
import com.example.Atiko.entities.User;
import com.example.Atiko.entities.UserProfile;
import com.example.Atiko.repositories.UserProfileRepository;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;
    @Autowired
    private FileStorageService fileStorageService;

    // Convert UserProfileDto to Profile
    private UserProfile convertToEntity(UserProfileDto dto) {
        UserProfile profile = new UserProfile();
        profile.setId(dto.getId());
        profile.setNom(dto.getNom());
        profile.setPrenoms(dto.getPrenoms());
        profile.setDateNaiss(dto.getDateNaiss());
        profile.setTelephone(dto.getTelephone());
        profile.setPays(dto.getPays());
        profile.setVille(dto.getVille());
        profile.setLocalisation(dto.getLocalisation());
        profile.setFonction(dto.getFonction());
        profile.setBio(dto.getBio());
        profile.setAvatar(dto.getAvatar());
        // Champs administratifs
        profile.setTypePieceIdentite(dto.getTypePieceIdentite());
        profile.setNumeroPieceIdentite(dto.getNumeroPieceIdentite());
        profile.setNumeroPermisConduire(dto.getNumeroPermisConduire());
        profile.setDateDelivrancePermis(dto.getDateDelivrancePermis());
        profile.setDateExpirationPermis(dto.getDateExpirationPermis());
        profile.setPaysDelivrancePermis(dto.getPaysDelivrancePermis());
        if (dto.getUser() != null) {
            User user = new User(dto.getUser().getId());
            profile.setUser(user);
        }
        System.out.println("\n\n\n UserProfile :"+profile+"\n\n\n");
        return profile;
    }

    // Convert Profile to UserProfileDto
    private UserProfileDto convertToDto(UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(profile.getId());
        dto.setNom(profile.getNom());
        dto.setPrenoms(profile.getPrenoms());
        dto.setDateNaiss(profile.getDateNaiss());
        dto.setTelephone(profile.getTelephone());
        dto.setPays(profile.getPays());
        dto.setVille(profile.getVille());
        dto.setLocalisation(profile.getLocalisation());
        dto.setFonction(profile.getFonction());
        dto.setBio(profile.getBio());
        dto.setAvatar(profile.getAvatar());
        // Champs administratifs
        dto.setTypePieceIdentite(profile.getTypePieceIdentite());
        dto.setNumeroPieceIdentite(profile.getNumeroPieceIdentite());
        dto.setNumeroPermisConduire(profile.getNumeroPermisConduire());
        dto.setDateDelivrancePermis(profile.getDateDelivrancePermis());
        dto.setDateExpirationPermis(profile.getDateExpirationPermis());
        dto.setPaysDelivrancePermis(profile.getPaysDelivrancePermis());
        if (profile.getUser() != null) {
            dto.setUser(new UserDto(profile.getUser()));
        }
        return dto;
    }

    // public List<ProfileDto> getAllProfiles() {
    //     List<Profile> profiles = userProfileRepository.findAll();
    //     return profiles.stream().map(this::convertToDto).toList();
    // }


    public UserProfileDto getProfileByUserId(Long userId) {
        Optional<UserProfile> optionalProfile = userProfileRepository.findByUserId(userId);
        return optionalProfile.map(this::convertToDto).orElse(null);
    }
    
    public UserProfileDto getProfileById(Long id) {
        Optional<UserProfile> optionalProfile = userProfileRepository.findById(id);
        return optionalProfile.map(this::convertToDto).orElse(null);
    }

    public UserProfileDto createProfile(UserProfileDto dto) throws IOException{
        UserProfile profile = convertToEntity(dto);
        UserProfile savedProfile = userProfileRepository.save(profile);
        return convertToDto(savedProfile);
    }

    public UserProfileDto updateProfile(Long id, UserProfileDto dto, MultipartFile file) throws IOException{
        System.out.println(dto.toString());
        if (userProfileRepository.existsById(id)) {
            dto.setId(id); // Set the ID from the path
            UserProfile profile = convertToEntity(dto);

            if(file != null && !file.isEmpty())
                profile.setAvatar(fileStorageService.storeFile(file));
            UserProfile updatedProfile = userProfileRepository.save(profile);
            System.out.println("\n\n\n Updated :"+updatedProfile.toString());

            return convertToDto(updatedProfile);
        }
        return null; // Or throw an exception
    }

    public boolean deleteProfile(Long id) {
        if (userProfileRepository.existsById(id)) {
            userProfileRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
