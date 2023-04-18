package ru.kata.spring.boot_security.demo.model;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "authorities")
public class Authority {

    public Authority() {
    }

    public Authority(String name) {
        this.name = name;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "name")
    private String name;
    @ManyToMany(mappedBy = "authorities", fetch = FetchType.LAZY)
    @Fetch(FetchMode.JOIN)
    private Set<Role> roles;
}
