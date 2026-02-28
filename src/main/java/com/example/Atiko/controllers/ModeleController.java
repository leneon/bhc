package com.example.Atiko.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RequestMapping(path = "/atiko/modeles")
@Controller
public class ModeleController {

    @Value("${app.name}")
    private String appName;

    
    @GetMapping(value = "", name = "modeles")
    public String dashboard(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Catégories");
        return "back-office/voitures/modeles";
    }

      
}
