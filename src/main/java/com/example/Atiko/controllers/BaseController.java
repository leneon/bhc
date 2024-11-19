package com.example.Atiko.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.Atiko.security.services.UserDetailsImpl;

@RequestMapping(path = "/bhc")
@Controller
public class BaseController {

    @Value("${app.name}")
    private String appName;

    @GetMapping("/")
    public String redirectToDashboard() {
        return "redirect:/bhc/dashboard";
    }
    
    @GetMapping(value = "/dashboard", name = "dashboard")
    public String dashboard(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Tableaux de Bord");
        return "back-office/pages/dashboard";
    }

    @GetMapping(value="/parametres", name = "parametes")
    public String infos(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Infos");
        return "back-office/pages/settings";
    }

    @GetMapping("/roles")
    public String roles(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Rôles");
        return "back-office/users/roles";
    }

    @GetMapping("/utilisateurs")
    public String users(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Utilisateurs");
        return "back-office/users/list";
    }

    @GetMapping("/utilisateurs/details/{id}")
    public String details(Model model, @PathVariable Long id) {
        model.addAttribute("userId", id);
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Utilisateurs");
        return "back-office/users/details";
    }
    
    @GetMapping("/utilisateurs/password")
    public String password(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Mot de passe");
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         UserDetailsImpl userDetails  = (UserDetailsImpl) authentication.getPrincipal();
        model.addAttribute("userId", userDetails.getId());

        return "back-office/users/password";
    }
    @GetMapping("/categories")
    public String categories(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Catégories");
        return "back-office/articles/categories";
    }
    @GetMapping("/articles")
    public String articles(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Articles");
        return "back-office/articles/articles";
    }
    @GetMapping("/services")
    public String services(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Services");
        return "back-office/services/services";
    }
    @GetMapping("/services/espaces")
    public String espaces(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Espaces");
        return "back-office/services/espaces";
    }
    @GetMapping("/services/contacts")
    public String contacts(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Services");
        return "back-office/services/contacts";
    }
    @GetMapping("/newsletters")
    public String news(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Newslaters");
        return "back-office/pages/newsletters";
    }
   
   
}
