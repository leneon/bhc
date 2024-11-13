package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.dtos.NewsletterDto;
import com.example.Atiko.services.NewsletterService;

import java.util.List;

@RestController
@RequestMapping("/api/newsletters")
public class NewsletterResource {

    @Autowired
    private NewsletterService newsletterService;

    @GetMapping
    public List<NewsletterDto> getAllNewsletters() {
        return newsletterService.getNewslettes();
    }

    @PostMapping
    public ResponseEntity<NewsletterDto> createNewsletter(@RequestBody NewsletterDto NewsletterDto) {
        NewsletterDto createdNewsletter = newsletterService.createNewsletter(NewsletterDto);
        return ResponseEntity.ok(createdNewsletter);
    }
   

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNewsletter(@PathVariable Long id) {
        newsletterService.deleteNewsletter(id);
        return ResponseEntity.noContent().build();
    }
}
