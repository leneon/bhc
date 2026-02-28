package com.example.Atiko.entities;

import java.util.Random;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
  @Id
  private Long id;
  @PrePersist
    public void prePersist() {
        if (id == null) {
            this.id = System.currentTimeMillis() * 1000 + new Random().nextInt(1000);
        }
    }

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private ERole name;

  public Role() {

  }

  public Role(ERole name) {
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ERole getName() {
    return name;
  }

  public void setName(ERole name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "Role [id=" + id + ", name=" + name + "]";
  }
}