package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.security.Details;
import ru.kata.spring.boot_security.demo.service.RoleService;


@Controller
@RequestMapping( "/admin")
public class AdminsController {
    private final RoleService roleService;

    public AdminsController( RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("")
    public String showUsersList(@AuthenticationPrincipal Details userDetails, Model model) {
        model.addAttribute("currentUser",  userDetails.getUser());
        model.addAttribute("roles", roleService.findAll());
        return "admin";
    }
}
