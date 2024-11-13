package com.example.Atiko.dtos;
import org.springframework.stereotype.Component;

import com.example.Atiko.entities.Structure;

@Component
public class StructureMapper {

    public StructureDto toDto(Structure structure) {
        StructureDto dto = new StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setTelephone(structure.getTelephone());
        dto.setEmail(structure.getEmail());
        dto.setDateCreation(structure.getDateCreation());
        dto.setLocalisation(structure.getLocalisation());
        dto.setGps(structure.getGps());
        dto.setLogo(structure.getLogo());
        dto.setPays(structure.getPays());
        dto.setVille(structure.getVille());
        dto.setBio(structure.getBio());
        dto.setDescription(structure.getDescription());
        dto.setImg(structure.getImg());
        dto.setImg1(structure.getImg1());
        dto.setImg2(structure.getImg2());
        dto.setFacebook(structure.getFacebook());
        dto.setYoutube(structure.getYoutube());
        dto.setInstagram(structure.getInstagram());
        dto.setTwitter(structure.getTwitter());
        return dto;
    }

    public Structure toEntity(StructureDto dto) {
        Structure structure = new Structure();
        structure.setId(dto.getId());
        structure.setNom(dto.getNom());
        structure.setTelephone(dto.getTelephone());
        structure.setEmail(dto.getEmail());
        structure.setDateCreation(dto.getDateCreation());
        structure.setLocalisation(dto.getLocalisation());
        structure.setGps(dto.getGps());
        structure.setLogo(dto.getLogo());
        structure.setPays(dto.getPays());
        structure.setVille(dto.getVille());
        structure.setBio(dto.getBio());
        structure.setDescription(dto.getDescription());
        structure.setImg(dto.getImg());
        structure.setImg1(dto.getImg1());
        structure.setImg2(dto.getImg2());
        structure.setYoutube(dto.getYoutube());
        structure.setFacebook(dto.getFacebook());
        structure.setTwitter(dto.getTwitter());
        structure.setInstagram(dto.getInstagram());
        return structure;
    }
}
