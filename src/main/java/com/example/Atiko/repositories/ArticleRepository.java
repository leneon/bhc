package com.example.Atiko.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    
}
