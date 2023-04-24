package ru.kata.spring.boot_security.demo.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;


import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsersList() {
        System.out.println("Приложение начало работу метода getUsersList");
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/users/getAuth")
    public ResponseEntity<Optional<User>> getAuthUser(Principal principal) {
        System.out.println("Приложение начало работу метода getUserId");
        return ResponseEntity.ok(userService.getByName(principal.getName()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") long id) {
        System.out.println("Приложение начало работу метода getUser");
        User user = userService.getById(id);
        System.out.println(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        System.out.println("Приложение начало работу метода createUser");
        userService.saveUser(user);
        return new ResponseEntity(user, HttpStatus.CREATED);
    }

    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        System.out.println("Приложение начало работу метода saveUser");
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) {
        System.out.println("Приложение начало работу метода deleteUser");
        String username = userService.getById(id).getUsername();
        userService.deleteById(id);
        return new ResponseEntity<>(username, HttpStatus.ACCEPTED);
    }
}