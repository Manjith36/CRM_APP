package com.examly.springapp.controller;

import com.examly.springapp.model.Interaction;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InteractionController {

    @Autowired
    private InteractionRepository interactionRepository;
    
    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/interactions")
    public ResponseEntity<?> createInteraction(@RequestBody Interaction interaction) {
        if (!customerRepository.existsById(interaction.getCustomerId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Customer not found"));
        }
        
        interaction.setInteractionDate(LocalDateTime.now());
        Interaction saved = interactionRepository.save(interaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/customers/{customerId}/interactions")
    public ResponseEntity<List<Interaction>> getInteractionsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(interactionRepository.findByCustomerId(customerId));
    }
}