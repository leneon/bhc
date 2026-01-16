package com.example.Atiko.dtos;

import lombok.Data;

@Data
public class ImageVoitureDto {
    private Long id;
    private String url;
    private Long voitureId;
    public ImageVoitureDto( String url, Long voitureId) {
        this.url = url;
        this.voitureId = voitureId;
    }
    public ImageVoitureDto() {
    }   
} 