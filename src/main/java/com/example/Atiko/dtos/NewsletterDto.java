package com.example.Atiko.dtos;

import com.example.Atiko.entities.Newsletter;

public class NewsletterDto {
    private Long id;
    private String useremail;
    public NewsletterDto(Newsletter news) {
        this.id = news.getId();
        this.useremail = news.getUseremail();
    }
    public NewsletterDto() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUseremail() {
        return useremail;
    }
    public void setUseremail(String useremail) {
        this.useremail = useremail;
    }
    
}
