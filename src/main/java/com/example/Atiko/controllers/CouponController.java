package com.example.Atiko.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(path = "/atiko/coupons")
@Controller
public class CouponController {

    @Value("${app.name}")
    private String appName;

    @GetMapping(value = "", name = "coupons")
    public String index(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Gestion des coupons");
        return "back-office/coupons/list";
    }

    @GetMapping(value = "/create", name = "create-coupon")
    public String create(Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Nouveau coupon");
        model.addAttribute("couponId", null);
        return "back-office/coupons/form";
    }

    @GetMapping(value = "/edit/{id}", name = "edit-coupon")
    public String edit(@PathVariable Long id, Model model) {
        model.addAttribute("appName", appName);
        model.addAttribute("title", "Modifier le coupon");
        model.addAttribute("couponId", id);
        return "back-office/coupons/form";
    }
}
