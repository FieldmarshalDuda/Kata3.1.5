package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UsersRestController {
    private final UserService service;

    public UsersRestController(UserService service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<Optional<User>> getAuthUser(Principal principal) {
        System.out.println("Приложение начало работу метода getUserId");
        return ResponseEntity.ok(service.getByName(principal.getName()));
    }
}
