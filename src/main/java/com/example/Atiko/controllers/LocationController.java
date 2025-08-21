package com.example.Atiko.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.Atiko.entities.Voiture;


@RequestMapping(path = "/atiko/locations")
@Controller
public class LocationController {

    @Value("${app.name}")
    private String appName;

    
    @GetMapping(value = "", name = "locations")
    public String index(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Locations");
        return "back-office/locations/list";
    }

    @GetMapping(value = "/reservation", name = "reservation")
    public String create(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Réservation de voiture");
        return "back-office/locations/reservation";
    }
    @GetMapping(value = "/reservations", name = "reservations")
    public String reservations(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Réservations de voiture");
        return "back-office/locations/reservations";
    }

  @GetMapping(value = "/{id}", name = "details-location")
public String detail(@PathVariable("id") Long id, Model model) {
    // Récupération de la voiture
    
    if (id == null) {
        // Option : rediriger vers la liste si la voiture n'existe pas
        return "redirect:/voitures";
    }

    // Variables générales
    model.addAttribute("appName", appName);
    model.addAttribute("title", "Détails Location");

    // Données de la voiture
    model.addAttribute("voitureId", id);

    return "back-office/voitures/voiture";
}

      
}
