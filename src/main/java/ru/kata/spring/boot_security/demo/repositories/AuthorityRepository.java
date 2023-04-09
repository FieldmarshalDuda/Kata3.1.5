package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring.boot_security.demo.model.Authority;


public interface AuthorityRepository extends JpaRepository<Authority, Integer> {
    Authority findByName(String name);
}
