package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.security.Details;
import ru.kata.spring.boot_security.demo.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UsersRestController {
    @GetMapping("")
    public ResponseEntity<User> getRestUser(@AuthenticationPrincipal Details details) {
        System.out.println("Приложение начало работу метода getRestUser");
        User user = details.getUser();
        System.out.println(user);
        return ResponseEntity.ok(user);
    }
}
