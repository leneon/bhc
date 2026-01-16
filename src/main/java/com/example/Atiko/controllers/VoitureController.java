package com.example.Atiko.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;



@RequestMapping(path = "/atiko/voitures")
@Controller
public class VoitureController {

    @Value("${app.name}")
    private String appName;

    
    @GetMapping(value = "", name = "voitures")
    public String index(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Voitures");
        return "back-office/voitures/voitures";
    }

  @GetMapping(value = "/{id}", name = "Details-voiture")
public String detail(@PathVariable("id") Long id, Model model) {
    // Récupération de la voiture
    
    if (id == null) {
        // Option : rediriger vers la liste si la voiture n'existe pas
        return "redirect:/voitures";
    }

    // Variables générales
    model.addAttribute("appName", appName);
    model.addAttribute("title", "Détails de la voiture");

    // Données de la voiture
    model.addAttribute("voitureId", id);

    return "back-office/voitures/voiture";
}

      
}
