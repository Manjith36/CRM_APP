package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8082")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully", "user", saved));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", user.get()));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }
}