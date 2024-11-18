package com.example.Atiko.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

@RequestMapping
@Controller
public class UnAuthController {

    @Value("${app.name}")
    private String appName;

    @GetMapping("/")
    public String index(Model model){
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Accueil");
        return ("front-office/pages/index");
    }

    @GetMapping("/qui-sommes-nous")
    public String abut(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Qui sommes-nous");
        return "front-office/pages/about";
    }
    @GetMapping("/contact")
    public String contact(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Contact");
        return "front-office/pages/contact";
    }
    @GetMapping("/blog")
    public String blog(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Blog");
        return "front-office/pages/blog";
    }

    @GetMapping("/details-article")
    public String details(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Details");
        return "front-office/pages/details";
    }

    @GetMapping("/services")
    public String service(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Services");
        return "front-office/pages/service";
    }

        
    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Se connecter");        
    return "auth/login";
    }
            
    @GetMapping("/reinitialiser")
    public String reinitialiser(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Réinitialiser mon mot de passe");        
    return "auth/reset-password";
    }
            
    @GetMapping("/nouveau")
    public String nouveau(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Nouveau mot de passe");        
    return "auth/new-password";
    }
 
   
    @GetMapping("/details-article/{id}")
    public String gestions(Model model, @PathVariable Long id) {
        model.addAttribute("articleId", id);
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Détails article");
        return "front-office/pages/details";
    }

       
    @GetMapping("/blog-details/{id}")
    public String blogDetails(Model model, @PathVariable Long id) {
        model.addAttribute("articleId", id);
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Détails du blog");
        return "front-office/pages/single-blog";
    }
    
    
    @GetMapping("/services*appui-techniques")
    public String appi(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Appui");        
    return "front-office/services/appui";
    }
    @GetMapping("/services-location-espaces")
    public String location(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Locations");        
    return "front-office/services/espaces";
    }
    @GetMapping("/services-domiciliation-d-entreprise")
    public String domiciliations(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Domiciliations");        
    return "front-office/services/location";
    }
    @GetMapping("services-incubations")
    public String incubations(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Nouveau mot de passe");        
    return "front-office/services/appui";
    }
    @GetMapping("/services-gestion-projets")
    public String gestions(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Nouveau mot de passe");        
    return "front-office/services/gestion";
    }

    
}
