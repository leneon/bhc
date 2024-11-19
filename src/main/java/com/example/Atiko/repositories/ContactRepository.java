package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.Contact;


public interface ContactRepository extends JpaRepository<Contact, Long> {
    // Vous pouvez ajouter des méthodes personnalisées ici si nécessaire
}

