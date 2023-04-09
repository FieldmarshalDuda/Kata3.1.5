package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Authority;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.AuthorityRepository;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;


import java.util.*;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder encoder;

    @Autowired

    public SetupDataLoader(AuthorityRepository authorityRepository, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder) {
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
    }


    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {

        if (alreadySetup)
            return;
        Authority readAuthority
                = createAuthorityIfNotFound("READ_PRIVILEGE");
        Authority writeAuthority
                = createAuthorityIfNotFound("WRITE_PRIVILEGE");

        List<Authority> adminAuthorities = Arrays.asList(
                readAuthority, writeAuthority);
        createRoleIfNotFound("ROLE_ADMIN", adminAuthorities);
        createRoleIfNotFound("ROLE_USER", Collections.singletonList(readAuthority));
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        Role userRole = roleRepository.findByName("ROLE_USER");
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(encoder.encode("admin"));
        admin.setRoles(Set.of(adminRole, userRole));
        userRepository.save(admin);
        User user = new User();
        user.setUsername("user");
        user.setPassword(encoder.encode("user"));
        user.setRoles(Set.of(userRole));
        userRepository.save(user);

        alreadySetup = true;
    }

    @Transactional
    Authority createAuthorityIfNotFound(String name) {

        Authority authority = authorityRepository.findByName(name);
        if (authority == null) {
            authority = new Authority(name);
            authorityRepository.save(authority);
        }
        return authority;
    }

    @Transactional
    Role createRoleIfNotFound(
            String name, Collection<Authority> authorities) {

        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role(name);
            role.setAuthorities(authorities);
            roleRepository.save(role);
        }
        return role;
    }
}
