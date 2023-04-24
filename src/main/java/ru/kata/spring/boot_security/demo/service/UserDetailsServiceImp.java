package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ru.kata.spring.boot_security.demo.model.Authority;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import ru.kata.spring.boot_security.demo.security.Details;

import java.util.Collection;
import java.util.LinkedList;
import java.util.Optional;

@Service("userDetailService")
public class UserDetailsServiceImp implements UserDetailsService {
    private final UserRepository userRepo;

    @Autowired
    public UserDetailsServiceImp(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public Details loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepo.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("No such user");
        }
        Details details = new Details(user.get());
        // For each user's authority, add it into our authorities' collection.
        Collection<GrantedAuthority> grantedAuthorities = new LinkedList<GrantedAuthority>();
        if (details.getAuthorities().size() > 0){
            for (GrantedAuthority authority : details.getAuthorities()) {
                // Add a new GrantedAuthority for each user's authorities.
                grantedAuthorities.add(new SimpleGrantedAuthority(authority.getAuthority()));
            }
        }
        return details;
    }
}
