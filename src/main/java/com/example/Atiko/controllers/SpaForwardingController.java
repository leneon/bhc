package com.example.Atiko.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardingController {

  @GetMapping("/{path:[^\\.]*}")
  public String forwardSpaRoutes(HttpServletRequest request) {
    String uri = request.getRequestURI();
    if (uri != null && uri.startsWith("/api/")) {
      return "forward:/error";
    }
    return "forward:/front/index.html";
  }
}

