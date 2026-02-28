package com.example.Atiko.services;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.Atiko.dtos.ContactDTO;
import com.example.Atiko.entities.Contact;
import com.example.Atiko.repositories.ContactRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;


    // Méthode pour créer un contact
    public Contact createContact(ContactDTO contactDTO) {
        Contact contact = new Contact();
        contact.setUsername(contactDTO.getUsername());
        contact.setUseremail(contactDTO.getUseremail());
        contact.setUserphone(contactDTO.getUserphone());
        contact.setService(contactDTO.getservice());
        contact.setMessage(contactDTO.getMessage());

     

        // Ajouter le statut (par défaut "PENDING")
        contact.setStatus(contactDTO.getStatus() != null ? contactDTO.getStatus() : "EN ATTENTE");

        // Sauvegarder le contact dans la base de données
        return contactRepository.save(contact);
    }

    // Méthode pour approuver un contact
    public Contact approveContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + contactId));
        
        contact.setStatus("APPROUVE");  // Modifier le statut à "APPROVED"
        return contactRepository.save(contact);
    }

    public List<Contact> findAll() {
        return contactRepository.findAll();
    }
    // Méthode pour rejeter un contact
    public Contact rejectContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + contactId));
        
        contact.setStatus("REJETE");  // Modifier le statut à "REJECTED"
        return contactRepository.save(contact);
    }
}
