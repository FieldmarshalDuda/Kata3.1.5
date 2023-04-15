package ru.kata.spring.boot_security.demo.controller;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.security.Details;


@Controller
@RequestMapping("/user")
public class UsersController {

    @GetMapping("")
    public String showUserPage(@AuthenticationPrincipal Details userdetails, Model model) {
        model.addAttribute("currentUser", userdetails.getUser());
        return "user";
    }
}
