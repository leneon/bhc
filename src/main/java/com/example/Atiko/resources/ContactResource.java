package com.example.Atiko.resources;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.dtos.ContactDTO;
import com.example.Atiko.entities.Contact;
import com.example.Atiko.services.ContactService;

@RestController
@RequestMapping("/api/contacts")
public class ContactResource {

    @Autowired
    private ContactService contactService;

    // Endpoint pour créer un contact
    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody ContactDTO contactDTO) {
        try {
            // Créer un contact et le sauvegarder dans la base de données
            Contact savedContact = contactService.createContact(contactDTO);
            return new ResponseEntity<>(savedContact, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.findAll() ;
    }

    // Endpoint pour approuver un contact
    @PutMapping("/{contactId}/approve")
    public ResponseEntity<Contact> approveContact(@PathVariable Long contactId) {
        try {
            Contact approvedContact = contactService.approveContact(contactId);
            return new ResponseEntity<>(approvedContact, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint pour rejeter un contact
    @PutMapping("/{contactId}/reject")
    public ResponseEntity<Contact> rejectContact(@PathVariable Long contactId) {
        try {
            Contact rejectedContact = contactService.rejectContact(contactId);
            return new ResponseEntity<>(rejectedContact, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
