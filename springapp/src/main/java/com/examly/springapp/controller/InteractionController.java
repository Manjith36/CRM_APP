package com.examly.springapp.controller;

import com.examly.springapp.model.Interaction;
import com.examly.springapp.service.InteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8082")
public class InteractionController {

    @Autowired
    private InteractionService interactionService;

    @PostMapping("/interactions")
    public ResponseEntity<?> createInteraction(@RequestBody Interaction interaction) {
        try {
            Interaction saved = interactionService.createInteraction(interaction);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/customers/{customerId}/interactions")
    public ResponseEntity<List<Interaction>> getInteractionsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(interactionService.getInteractionsByCustomerId(customerId));
    }
    
    @PutMapping("/interactions/{id}")
    public ResponseEntity<?> updateInteraction(@PathVariable Long id, @RequestBody Interaction interaction) {
        try {
            Interaction updated = interactionService.updateInteraction(id, interaction);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}