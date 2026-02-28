package com.example.Atiko.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Random;

@Entity
@Table(name = "image_voitures")
@Data
@NoArgsConstructor
public class ImageVoiture {
    @Id
    private Long id;
    
    @PrePersist
    public void prePersist() {
        if (id == null) {
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
        }
    }
    
    @Column(nullable = false)
    private String url;
    
    @ManyToOne
    @JoinColumn(name = "voiture_id")
    private Voiture voiture;

    public ImageVoiture( Voiture voiture, String url) {
        this.url = url;
        this.voiture = voiture;
    }
} 