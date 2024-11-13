package com.example.Atiko.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Atiko.dtos.ProfileDto;
import com.example.Atiko.dtos.UserDto;
import com.example.Atiko.entities.Profile; // Assuming this is your entity class
import com.example.Atiko.entities.User;
import com.example.Atiko.repositories.ProfileRepository;

import java.io.IOException;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private FileStorageService fileStorageService;

    // Convert ProfileDto to Profile
    private Profile convertToEntity(ProfileDto profileDto) {
        Profile profile = new Profile();
        profile.setId(profileDto.getId());
        profile.setNom(profileDto.getNom());
        profile.setPrenoms(profileDto.getPrenoms());
        profile.setDateNaiss(profileDto.getDateNaiss());
        profile.setTelephone(profileDto.getTelephone());
        profile.setPays(profileDto.getPays());
        profile.setVille(profileDto.getVille());
        profile.setLocalisation(profileDto.getLocalisation());
        profile.setFonction(profileDto.getFonction());
        profile.setBio(profileDto.getBio());
        User user = new User(profileDto.getUser().getId());
        profile.setUser(user);
        System.out.println("\n\n\n Profile :"+profile+"\n\n\n");

        // Set other fields as necessary
        return profile;
    }

    // Convert Profile to ProfileDto
    private ProfileDto convertToDto(Profile profile) {
        ProfileDto profileDto = new ProfileDto();
        profileDto.setId(profile.getId());
        profileDto.setNom(profile.getNom());
        profileDto.setPrenoms(profile.getPrenoms());
        profileDto.setDateNaiss(profile.getDateNaiss());
        profileDto.setTelephone(profile.getTelephone());
        profileDto.setPays(profile.getPays());
        profileDto.setVille(profile.getVille());
        profileDto.setLocalisation(profile.getLocalisation());
        profileDto.setFonction(profile.getFonction());
        profileDto.setBio(profile.getBio());
        profileDto.setAvatar(profile.getAvatar());
        profileDto.setUser(new UserDto(profile.getUser()));
        // Set other fields as necessary
        return profileDto;
    }

    // public List<ProfileDto> getAllProfiles() {
    //     List<Profile> profiles = profileRepository.findAll();
    //     return profiles.stream().map(this::convertToDto).toList();
    // }


    public ProfileDto getProfileByUserId(Long userId) {
        Optional<Profile> optionalProfile = profileRepository.findByUserId(userId);
        return optionalProfile.map(this::convertToDto).orElse(null);
    }
    
    public ProfileDto getProfileById(Long id) {
        Optional<Profile> optionalProfile = profileRepository.findById(id);
        return optionalProfile.map(this::convertToDto).orElse(null);
    }

    public ProfileDto createProfile(ProfileDto profileDto) throws IOException{
        Profile profile = convertToEntity(profileDto);
        Profile savedProfile = profileRepository.save(profile);
        return convertToDto(savedProfile);
    }

    public ProfileDto updateProfile(Long id, ProfileDto profileDto, MultipartFile file) throws IOException{
        System.out.println(profileDto.toString());
        if (profileRepository.existsById(id)) {
            profileDto.setId(id); // Set the ID from the path
            Profile profile = convertToEntity(profileDto);

            if(!file.isEmpty() && file!=null)
                profile.setAvatar(fileStorageService.storeFile(file));
            Profile updatedProfile = profileRepository.save(profile);
        System.out.println("\n\n\n Updated :"+updatedProfile.toString());

            return convertToDto(updatedProfile);
        }
        return null; // Or throw an exception
    }

    public boolean deleteProfile(Long id) {
        if (profileRepository.existsById(id)) {
            profileRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
