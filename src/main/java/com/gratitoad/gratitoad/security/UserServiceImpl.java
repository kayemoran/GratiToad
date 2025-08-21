package com.gratitoad.gratitoad.security;

import com.gratitoad.gratitoad.entity.User;
import com.gratitoad.gratitoad.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Hämta användare från databas
        User user = userRepository.findByUser(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Skapa Spring Security User (returnera UserDetails)
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUser()) // Användarnamn
                .password(user.getPassword()) // Krypterat lösenord från databas
                .roles("USER") // Enkel roll (kan göras dynamisk senare)
                .build();
    }
}