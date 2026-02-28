package com.example.Atiko.entities;

import java.util.Random;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "newsletters", uniqueConstraints = { @UniqueConstraint(columnNames = "useremail") })
public class Newsletter {
    @Id
    private Long id; 
    @PrePersist
    public void prePersist() {
        if (id == null) {
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
        }
    }
    @Column
    private String useremail;

    
    public Newsletter() {
    }
    public String getUseremail() {
        return useremail;
    }
    public void setUseremail(String useremail) {
        this.useremail = useremail;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}
